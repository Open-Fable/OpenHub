import { promises as fs } from "fs";
import path from "path";
import { collectFiles, type ServedSiteProblem } from "./orchestrator-quality.js";

// ── Cross-module symbol resolution (Couche 1 — force-fail) ─────────────────────
// The #1 multi-agent failure mode is incoherent APIs across files: agent A's
// entry point imports `sort_data` from B, but B (written by another agent)
// exports a `DataSorter` class instead → the program never even imports. This is
// invisible to a text-judging LLM verifier and to per-file checks. We catch it
// with a STATIC parse (no code execution → safe in the main process) of the
// import graph, for Python and TS/JS. Two problem classes:
//   • broken import — a NAMED import resolved to a local module that doesn't
//     define/export that symbol → the deliverable can't run.
//   • orphan module — a non-entry, non-test source file that exports symbols but
//     that no other file imports → unintegrated agent output / dead code.

type ModuleLang = "py" | "ts";

const TS_SOURCE_EXTS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];

interface ModuleInfo {
  // Names this module provides to importers.
  readonly exports: Set<string>;
  // True when the module re-exports an unknown set (export * / from x import *) —
  // we then can't prove a name is missing, so we skip name checks against it.
  readonly wildcardExports: boolean;
  // Local + external imports (spec kept raw; resolved later against the file set).
  readonly imports: ReadonlyArray<{
    readonly spec: string;
    readonly names: readonly string[];
    readonly checkNames: boolean;
  }>;
}

function parsePythonModule(content: string): ModuleInfo {
  const exports = new Set<string>();
  let wildcardExports = false;
  const imports: Array<{ spec: string; names: string[]; checkNames: boolean }> = [];

  for (const raw of content.split("\n")) {
    const line = raw.replace(/#.*$/, "");
    let m = /^(?:async\s+)?def\s+([A-Za-z_]\w*)/.exec(line);
    if (m) {
      exports.add(m[1]);
      continue;
    }
    m = /^class\s+([A-Za-z_]\w*)/.exec(line);
    if (m) {
      exports.add(m[1]);
      continue;
    }
    // Module-level binding `NAME = …` / `NAME: type = …` (col 0, not ==/+=).
    m = /^([A-Za-z_]\w*)\s*(?::[^=\n]+)?=(?!=)/.exec(line);
    if (m) {
      exports.add(m[1]);
      continue;
    }
    m = /^\s*from\s+([.\w]+)\s+import\s+(.+)$/.exec(line);
    if (m) {
      const spec = m[1];
      const rest = m[2].trim();
      if (rest.startsWith("*")) {
        wildcardExports = true; // `from X import *` re-exports an unknown set
        imports.push({ spec, names: [], checkNames: false });
        continue;
      }
      const names = rest
        .replace(/[()]/g, "")
        .split(",")
        .map((s) =>
          s
            .trim()
            .split(/\s+as\s+/)[0]
            .trim(),
        )
        .filter(Boolean);
      for (const n of names) exports.add(n); // re-exported → provided here too
      imports.push({ spec, names, checkNames: true });
      continue;
    }
    m = /^\s*import\s+([.\w]+)/.exec(line);
    if (m) imports.push({ spec: m[1], names: [], checkNames: false });
  }
  return { exports, wildcardExports, imports };
}

function parseTsModule(content: string): ModuleInfo {
  const exports = new Set<string>();
  let wildcardExports = false;
  const imports: Array<{ spec: string; names: string[]; checkNames: boolean }> = [];
  const src = content.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

  for (const m of src.matchAll(
    /export\s+(?:default\s+)?(?:async\s+)?(?:abstract\s+)?(?:function|class|const|let|var|interface|type|enum)\s+([A-Za-z_$][\w$]*)/g,
  )) {
    exports.add(m[1]);
  }
  if (/export\s+default\b/.test(src)) exports.add("default");

  // export { a, b as c }  — local named exports; `… from '…'` makes it a re-export.
  for (const m of src.matchAll(/export\s*\{([^}]*)\}\s*(?:from\s*['"]([^'"]+)['"])?/g)) {
    const parts = m[1]
      .split(",")
      .map((s) => s.trim().replace(/^type\s+/, ""))
      .filter(Boolean);
    for (const p of parts) {
      const seg = p.split(/\s+as\s+/);
      exports.add((seg[1] ?? seg[0]).trim());
    }
    const fromSpec = m[2];
    if (fromSpec) {
      const srcNames = parts.map((p) => p.split(/\s+as\s+/)[0].trim()).filter(Boolean);
      imports.push({ spec: fromSpec, names: srcNames, checkNames: true });
    }
  }
  for (const m of src.matchAll(
    /export\s*\*\s*(?:as\s+[\w$]+\s+)?from\s*['"]([^'"]+)['"]/g,
  )) {
    wildcardExports = true;
    imports.push({ spec: m[1], names: [], checkNames: false });
  }
  for (const m of src.matchAll(/import\s+([^'"]+?)\s+from\s*['"]([^'"]+)['"]/g)) {
    const clause = m[1].trim();
    const spec = m[2];
    if (/\*\s+as\s+/.test(clause)) {
      imports.push({ spec, names: [], checkNames: false }); // namespace import
      continue;
    }
    const braces = /\{([^}]*)\}/.exec(clause);
    const named = braces
      ? braces[1]
          .split(",")
          .map((p) => p.trim().replace(/^type\s+/, ""))
          .filter(Boolean)
          .map((p) => p.split(/\s+as\s+/)[0].trim())
      : [];
    imports.push({ spec, names: named, checkNames: named.length > 0 });
  }
  for (const m of src.matchAll(/import\s*['"]([^'"]+)['"]/g)) {
    imports.push({ spec: m[1], names: [], checkNames: false }); // side-effect import
  }
  return { exports, wildcardExports, imports };
}

function resolveLocalModule(
  spec: string,
  fromRel: string,
  byRel: ReadonlySet<string>,
  lang: ModuleLang,
): string | null {
  const norm = (p: string): string => p.replace(/\\/g, "/").replace(/^\.\//, "");
  const fromDir = path.posix.dirname(norm(fromRel));

  if (lang === "ts") {
    if (!spec.startsWith(".") && !spec.startsWith("/")) return null; // npm package
    const base = norm(
      spec.startsWith("/") ? spec.slice(1) : path.posix.join(fromDir, spec),
    );
    const candidates: string[] = [];
    if (path.posix.extname(base)) candidates.push(base);
    else {
      for (const ext of TS_SOURCE_EXTS) candidates.push(base + ext);
      for (const ext of TS_SOURCE_EXTS) candidates.push(`${base}/index${ext}`);
    }
    for (const c of candidates) if (byRel.has(c)) return c;
    return null;
  }

  // Python: dotted module, optional leading dots for relative imports.
  const lead = /^\.+/.exec(spec);
  let dotted = spec;
  let dir = fromDir;
  if (lead) {
    dotted = spec.slice(lead[0].length);
    for (let i = 0; i < lead[0].length - 1; i++) dir = path.posix.dirname(dir);
  }
  const relPath = dotted.replace(/\./g, "/") + ".py";
  const candidates = lead
    ? [norm(path.posix.join(dir, relPath))]
    : [relPath, `src/${relPath}`];
  for (const c of candidates) if (byRel.has(c)) return c;
  // Fallback: match by basename anywhere (sys.path hacks are common in scripts).
  const baseName = (dotted.split(".").pop() ?? "") + ".py";
  for (const rel of byRel) if (path.posix.basename(rel) === baseName) return rel;
  return null;
}

const ORPHAN_SKIP_RE =
  /^(index|main|app|server|cli|setup|conftest|__main__|__init__)\.|\.config\.|\.d\.ts$/i;
// Test files are entry points for the test runner — never imported by source, so
// they must not be flagged as orphans (JS `.test.`/`.spec.` + Python test_*/*_test).
const TEST_FILE_RE = /(\.(test|spec)\.|^test_.*\.py$|_test\.py$|^test\.py$)/i;

/**
 * COUCHE 1 — force-fail. Static import-graph analysis (Python + TS/JS). Returns
 * broken cross-module imports (a named symbol imported from a local module that
 * doesn't provide it) and orphan modules (exporting files no one imports). Both
 * are deterministic and attributed to the owning agent by the caller, so the
 * corrective cycle routes the fix. No code is executed.
 */
export async function findModuleGraphProblems(
  workspaceDir: string,
): Promise<readonly ServedSiteProblem[]> {
  const problems: ServedSiteProblem[] = [];
  const seen = new Set<string>(); // dedupe identical (file, problem) pairs
  const MAX_PROBLEMS = 60;
  const push = (sourceFile: string, problem: string): void => {
    const key = `${sourceFile}::${problem}`;
    if (seen.has(key)) return;
    seen.add(key);
    problems.push({ sourceFile, problem });
  };

  const groups: ReadonlyArray<{
    lang: ModuleLang;
    files: Array<{ rel: string; full: string }>;
  }> = [
    { lang: "py", files: await collectFiles(workspaceDir, (n) => /\.py$/i.test(n)) },
    {
      lang: "ts",
      files: await collectFiles(
        workspaceDir,
        (n) => /\.(ts|tsx|js|jsx|mjs|cjs)$/i.test(n) && !/\.d\.ts$/i.test(n),
      ),
    },
  ];

  for (const { lang, files } of groups) {
    if (files.length === 0) continue;
    const byRel = new Set(files.map((f) => f.rel.replace(/\\/g, "/")));
    const info = new Map<string, ModuleInfo>();
    for (const f of files) {
      try {
        const content = await fs.readFile(f.full, "utf-8");
        info.set(
          f.rel.replace(/\\/g, "/"),
          lang === "py" ? parsePythonModule(content) : parseTsModule(content),
        );
      } catch {
        /* unreadable — skip */
      }
    }

    // (1) Broken named imports.
    const importedTargets = new Set<string>();
    for (const f of files) {
      const relN = f.rel.replace(/\\/g, "/");
      const mod = info.get(relN);
      if (!mod) continue;
      for (const imp of mod.imports) {
        const target = resolveLocalModule(imp.spec, relN, byRel, lang);
        if (!target) continue;
        importedTargets.add(target);
        if (!imp.checkNames || problems.length >= MAX_PROBLEMS) continue;
        const targetMod = info.get(target);
        if (!targetMod || targetMod.wildcardExports) continue;
        for (const name of imp.names) {
          if (name === "default" || targetMod.exports.has(name)) continue;
          push(
            f.rel,
            `importe « ${name} » depuis ${target}, mais ce module ne définit/exporte pas « ${name} » — API incohérente entre agents (le livrable ne s'exécutera pas).`,
          );
          if (problems.length >= MAX_PROBLEMS) break;
        }
      }
    }

    // (2) Orphan modules — only meaningful when several files are expected to
    // wire together; conservative to avoid flagging legitimate standalone files.
    if (files.length >= 3) {
      for (const f of files) {
        if (problems.length >= MAX_PROBLEMS) break;
        const relN = f.rel.replace(/\\/g, "/");
        const name = path.posix.basename(relN);
        if (ORPHAN_SKIP_RE.test(name) || TEST_FILE_RE.test(name)) continue;
        if (/(^|\/)(dist|build)(\/|$)/i.test(relN)) continue;
        const mod = info.get(relN);
        if (!mod || mod.exports.size === 0) continue; // no API to integrate
        if (importedTargets.has(relN)) continue;
        push(
          f.rel,
          "module jamais importé par les autres fichiers — sortie d'agent non intégrée (code mort). Câble-le dans le point d'entrée ou supprime-le.",
        );
      }
    }
  }

  return problems;
}
