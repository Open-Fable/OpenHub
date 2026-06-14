import { describe, expect, it } from "vitest";
import {
  OrchestratorRunner,
  mapWithConcurrency,
  parseFilepathBlocks,
} from "./orchestrator-runner.js";
import type { Project } from "./project-store.js";

function makeNode(id: string, deps: string[] = []): Project {
  return {
    id,
    name: `Node ${id}`,
    instructions: "",
    color: "#000",
    dependencies: deps,
    createdAt: 0,
    updatedAt: 0,
  };
}

function runner(): OrchestratorRunner {
  return new OrchestratorRunner(() => {});
}

describe("resolveDAGWaves", () => {
  it("places independent nodes in a single wave", () => {
    const a = makeNode("a");
    const b = makeNode("b");
    const c = makeNode("c");
    const waves = runner().resolveDAGWaves([a, b, c]);
    expect(waves).toHaveLength(1);
    expect(waves[0].map((n) => n.id).sort()).toEqual(["a", "b", "c"]);
  });

  it("chains dependent nodes into separate waves", () => {
    const a = makeNode("a");
    const b = makeNode("b", ["a"]);
    const c = makeNode("c", ["b"]);
    const waves = runner().resolveDAGWaves([a, b, c]);
    expect(waves).toHaveLength(3);
    expect(waves[0].map((n) => n.id)).toEqual(["a"]);
    expect(waves[1].map((n) => n.id)).toEqual(["b"]);
    expect(waves[2].map((n) => n.id)).toEqual(["c"]);
  });

  it("groups nodes with shared dependency in one wave", () => {
    //   a
    //  / \
    // b   c
    //  \ /
    //   d
    const a = makeNode("a");
    const b = makeNode("b", ["a"]);
    const c = makeNode("c", ["a"]);
    const d = makeNode("d", ["b", "c"]);
    const waves = runner().resolveDAGWaves([a, b, c, d]);
    expect(waves).toHaveLength(3);
    expect(waves[0].map((n) => n.id)).toEqual(["a"]);
    expect(waves[1].map((n) => n.id).sort()).toEqual(["b", "c"]);
    expect(waves[2].map((n) => n.id)).toEqual(["d"]);
  });

  it("throws on circular dependency", () => {
    const a = makeNode("a", ["b"]);
    const b = makeNode("b", ["a"]);
    expect(() => runner().resolveDAGWaves([a, b])).toThrow("Dépendance circulaire");
  });

  it("ignores dependencies on nodes outside the input set", () => {
    const a = makeNode("a", ["external"]);
    const b = makeNode("b", ["a"]);
    const waves = runner().resolveDAGWaves([a, b]);
    expect(waves).toHaveLength(2);
    expect(waves[0].map((n) => n.id)).toEqual(["a"]);
    expect(waves[1].map((n) => n.id)).toEqual(["b"]);
  });

  it("returns empty array for empty input", () => {
    expect(runner().resolveDAGWaves([])).toEqual([]);
  });
});

describe("mapWithConcurrency", () => {
  it("processes all items and preserves order", async () => {
    const items = [1, 2, 3, 4, 5];
    const results = await mapWithConcurrency(items, 2, async (n) => n * 10);
    expect(results).toEqual([10, 20, 30, 40, 50]);
  });

  it("respects the concurrency limit", async () => {
    let active = 0;
    let maxActive = 0;
    const items = [1, 2, 3, 4, 5, 6];
    await mapWithConcurrency(items, 2, async () => {
      active++;
      maxActive = Math.max(maxActive, active);
      await new Promise((r) => setTimeout(r, 20));
      active--;
    });
    expect(maxActive).toBeLessThanOrEqual(2);
  });

  it("propagates errors from the callback", async () => {
    await expect(
      mapWithConcurrency([1], 1, async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
  });

  it("returns empty array for empty input", async () => {
    const results = await mapWithConcurrency([], 3, async (n: number) => n);
    expect(results).toEqual([]);
  });
});

describe("parseFilepathBlocks", () => {
  const fence = "```";

  it("extracts a single clean block", () => {
    const text = [
      `${fence}typescript filepath: src/a.ts`,
      "export const a = 1;",
      fence,
    ].join("\n");
    const blocks = parseFilepathBlocks(text);
    expect(blocks).toEqual([{ path: "src/a.ts", content: "export const a = 1;" }]);
  });

  it("extracts multiple blocks in order", () => {
    const text = [
      `${fence}typescript filepath: src/a.ts`,
      "const a = 1;",
      fence,
      "",
      "And the test:",
      "",
      `${fence}typescript filepath: tests/a.test.ts`,
      "test('a', () => {});",
      fence,
    ].join("\n");
    const blocks = parseFilepathBlocks(text);
    expect(blocks.map((b) => b.path)).toEqual(["src/a.ts", "tests/a.test.ts"]);
    expect(blocks[0].content).toBe("const a = 1;");
    expect(blocks[1].content).toBe("test('a', () => {});");
  });

  it("preserves nested same-length fences inside markdown (the truncation bug)", () => {
    const text = [
      `${fence}markdown filepath: README.md`,
      "# Title",
      "",
      "## Installation",
      "",
      `${fence}bash`,
      "npm install mylib",
      fence,
      "",
      "## Usage",
      "",
      `${fence}typescript`,
      "import { x } from 'mylib';",
      fence,
      "",
      "## Contributing",
      "",
      "PRs welcome.",
      fence,
    ].join("\n");
    const blocks = parseFilepathBlocks(text);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].path).toBe("README.md");
    // Full content survives — nested fences and trailing sections included.
    expect(blocks[0].content).toContain("npm install mylib");
    expect(blocks[0].content).toContain("import { x } from 'mylib';");
    expect(blocks[0].content).toContain("## Contributing");
    expect(blocks[0].content).toContain("PRs welcome.");
  });

  it("does not truncate code containing a stray fence before its real close", () => {
    const text = [
      `${fence}typescript filepath: src/engine.ts`,
      "/**",
      " * @example",
      ` * ${fence}`,
      " * validate('x@y.z')",
      ` * ${fence}`,
      " */",
      "export function validate(input: string): ValidationResult {",
      "  return { valid: true };",
      "}",
      fence,
    ].join("\n");
    const blocks = parseFilepathBlocks(text);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].content).toContain("export function validate");
    expect(blocks[0].content).toContain("return { valid: true };");
  });

  it("treats shorter inner fences as content when the opener is longer", () => {
    const text = [
      "````markdown filepath: README.md",
      "# Title",
      fence,
      "code()",
      fence,
      "````",
    ].join("\n");
    const blocks = parseFilepathBlocks(text);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].content).toBe(["# Title", fence, "code()", fence].join("\n"));
  });

  it("returns empty array when there are no filepath blocks", () => {
    expect(parseFilepathBlocks("just some prose\nwith no blocks")).toEqual([]);
  });

  it("captures content to EOF when the closing fence is missing", () => {
    const text = [`${fence}typescript filepath: src/a.ts`, "const a = 1;"].join("\n");
    const blocks = parseFilepathBlocks(text);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].content).toBe("const a = 1;");
  });
});
