// Pure parsers that turn an agent's raw text output into file writes / edits.
// No instance state, no I/O — kept separate from the execution engine so the
// (security-sensitive, fuzz-prone) parsing logic is isolated and unit-testable.

// ── Extraction des fichiers depuis la sortie LLM ─────────────────────────────
/**
 * Parse les blocs ```lang filepath: chemin … ``` d'une réponse d'agent.
 *
 * Robuste aux fences imbriquées de même longueur : un fichier dont le CONTENU
 * contient ses propres ``` (un README avec des exemples de code, un JSDoc
 * `@example`) ne doit pas être tronqué. La regex naïve `([\s\S]*?)```` se ferme
 * sur la PREMIÈRE fence interne et coupe le fichier en plein milieu. Ici, le
 * contenu d'un bloc va jusqu'à la DERNIÈRE fence de fermeture (longueur ≥ celle
 * de l'ouverture) avant le prochain marqueur `filepath:` ou la fin du texte —
 * les fences internes sont donc préservées comme contenu.
 *
 * Parsing ligne par ligne (pas de méga-regex) → linéaire, sans backtracking
 * catastrophique sur une sortie LLM adverse dans le process principal.
 */
export function parseFilepathBlocks(
  text: string,
): ReadonlyArray<{ path: string; content: string }> {
  const lines = text.split("\n");
  // `(?![Ee][Dd][Ii][Tt]…)` reserves ```edit filepath: for surgical SEARCH/REPLACE
  // blocks (parseEditBlocks) — otherwise this would parse them as a full-file write
  // and dump the raw SEARCH/REPLACE markers into the file. Case-INSENSITIVE on
  // "edit": a ```Edit / ```EDIT fence must be excluded here too, exactly matching
  // parseEditBlocks' case-insensitive opener, or the markers corrupt the file.
  const openerRe =
    /^(`{3,})(?![Ee][Dd][Ii][Tt][ \t]+filepath:)[\w-]*[ \t]+filepath:[ \t]*(.+?)[ \t]*$/;
  const openers: Array<{ line: number; filePath: string; fence: number }> = [];
  for (let i = 0; i < lines.length; i++) {
    const m = openerRe.exec(lines[i]);
    if (m) openers.push({ line: i, filePath: m[2].trim(), fence: m[1].length });
  }

  const blocks: Array<{ path: string; content: string }> = [];
  for (let k = 0; k < openers.length; k++) {
    const { line: openLine, filePath, fence } = openers[k];
    const start = openLine + 1;
    const boundary = k + 1 < openers.length ? openers[k + 1].line : lines.length;
    const closeRe = new RegExp("^`{" + fence + ",}[ \\t]*$");
    let end = boundary;
    for (let j = boundary - 1; j >= start; j--) {
      if (closeRe.test(lines[j])) {
        end = j;
        break;
      }
    }
    blocks.push({ path: filePath, content: lines.slice(start, end).join("\n") });
  }
  return blocks;
}

// ── Édition chirurgicale (SEARCH/REPLACE) ────────────────────────────────────
export interface SearchReplaceEdit {
  readonly search: string;
  readonly replace: string;
}

const EDIT_SEARCH_MARK = "<<<<<<< SEARCH";
const EDIT_DIVIDER_MARK = "=======";
const EDIT_REPLACE_MARK = ">>>>>>> REPLACE";

function parseSearchReplacePairs(lines: readonly string[]): SearchReplaceEdit[] {
  const edits: SearchReplaceEdit[] = [];
  let i = 0;
  while (i < lines.length) {
    if (lines[i].trim() !== EDIT_SEARCH_MARK) {
      i++;
      continue;
    }
    i++;
    const search: string[] = [];
    while (i < lines.length && lines[i].trim() !== EDIT_DIVIDER_MARK)
      search.push(lines[i++]);
    if (i >= lines.length) break; // malformed: no divider
    i++;
    const replace: string[] = [];
    while (i < lines.length && lines[i].trim() !== EDIT_REPLACE_MARK)
      replace.push(lines[i++]);
    if (i >= lines.length) break; // malformed: no closing marker
    i++;
    edits.push({ search: search.join("\n"), replace: replace.join("\n") });
  }
  return edits;
}

/**
 * Parse les blocs ```edit filepath: chemin … ``` dont le contenu est une suite de
 * paires SEARCH/REPLACE. Permet à un agent de MODIFIER quelques lignes d'un fichier
 * existant sans le réémettre en entier :
 *
 *   ```edit filepath: index.html
 *   <<<<<<< SEARCH
 *   <h1>Ancien</h1>
 *   =======
 *   <h1>Nouveau</h1>
 *   >>>>>>> REPLACE
 *   ```
 *
 * Parsing ligne par ligne (pas de méga-regex) → linéaire, sans backtracking
 * catastrophique sur sortie LLM adverse.
 */
export function parseEditBlocks(
  text: string,
): ReadonlyArray<{ path: string; edits: readonly SearchReplaceEdit[] }> {
  const lines = text.split("\n");
  // Case-insensitive on "edit"/"filepath" so ```Edit / ```EDIT are still routed
  // here (and excluded from parseFilepathBlocks) instead of corrupting the file.
  const openerRe = /^(`{3,})edit[ \t]+filepath:[ \t]*(.+?)[ \t]*$/i;
  const openers: Array<{ line: number; filePath: string; fence: number }> = [];
  for (let i = 0; i < lines.length; i++) {
    const m = openerRe.exec(lines[i]);
    if (m) openers.push({ line: i, filePath: m[2].trim(), fence: m[1].length });
  }

  const blocks: Array<{ path: string; edits: readonly SearchReplaceEdit[] }> = [];
  for (let k = 0; k < openers.length; k++) {
    const { line: openLine, filePath, fence } = openers[k];
    const start = openLine + 1;
    const boundary = k + 1 < openers.length ? openers[k + 1].line : lines.length;
    const closeRe = new RegExp("^`{" + fence + ",}[ \\t]*$");
    let end = boundary;
    for (let j = boundary - 1; j >= start; j--) {
      if (closeRe.test(lines[j])) {
        end = j;
        break;
      }
    }
    const edits = parseSearchReplacePairs(lines.slice(start, end));
    if (edits.length > 0) blocks.push({ path: filePath, edits });
  }
  return blocks;
}

/**
 * Applique une suite de paires SEARCH/REPLACE à un contenu. ALL-OR-NOTHING : chaque
 * SEARCH doit correspondre EXACTEMENT une seule fois ; sinon l'édition entière
 * échoue et le contenu d'origine est renvoyé inchangé (l'appelant retombe alors
 * sur la réémission complète du fichier). Le match unique évite d'éditer la
 * mauvaise occurrence ; `replace` est traité comme littéral (pas de motif $).
 */
export function applyEdits(
  original: string,
  edits: readonly SearchReplaceEdit[],
): { ok: boolean; content: string; failedSearch?: string } {
  let content = original;
  for (const { search, replace } of edits) {
    if (search.length === 0)
      return { ok: false, content: original, failedSearch: search };
    const first = content.indexOf(search);
    const last = content.lastIndexOf(search);
    if (first === -1 || first !== last) {
      return { ok: false, content: original, failedSearch: search };
    }
    content = content.slice(0, first) + replace + content.slice(first + search.length);
  }
  return { ok: true, content };
}

// ── Détecteur déterministe de troncature ─────────────────────────────────────
/**
 * Returns a short reason when a file's content looks cut off, else null.
 *
 * The output verifier used to GUESS truncation from a chat preview, and the
 * audit's own display cap was mistaken for disk truncation — wrongly failing
 * complete files and triggering destructive corrective cycles. This is the
 * factual signal that replaces the guess. Deliberately CONSERVATIVE (only
 * high-confidence cases) so it never raises a false alarm on a legitimately
 * short, clean deliverable.
 */
export function detectTruncation(content: string): string | null {
  const trimmed = content.replace(/\s+$/, "");
  if (trimmed.length === 0) return "fichier vide";

  // An odd number of ``` fences means a code block was opened but never closed.
  const fenceCount = trimmed.split("```").length - 1;
  if (fenceCount % 2 !== 0) return "bloc de code non fermé";

  // HTML that opens <html> but never closes it.
  if (/<html[\s>]/i.test(trimmed) && !/<\/html\s*>/i.test(trimmed)) {
    return "balise </html> manquante";
  }

  // Ends mid-sentence: the last non-empty line is prose that stops on a letter
  // or comma, with no terminal punctuation and no structural marker. Conservative
  // length/shape guards avoid flagging headers, list items, table rows or files
  // that simply close on a bracket/quote.
  const lastLine = trimmed.slice(trimmed.lastIndexOf("\n") + 1).trim();
  const endsClean = /[.!?:;)\]}>"\x60*|_]$/.test(lastLine) || /^[#\-*|>]/.test(lastLine);
  if (!endsClean && lastLine.length > 30 && /[\p{L},]$/u.test(lastLine)) {
    return `se termine en milieu de phrase : « …${lastLine.slice(-40)} »`;
  }

  return null;
}
