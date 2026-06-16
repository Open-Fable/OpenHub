import { describe, it, expect } from "vitest";
import {
  buildPermissions,
  isExcludedSegment,
  getChangedPaths,
  isSettled,
} from "./opencode-backend.js";

describe("buildPermissions", () => {
  const WS = "/tmp/workspace";

  it("denies everything by default, then allows read/write/edit/glob/grep", () => {
    const rules = buildPermissions(WS);
    expect(rules[0]).toEqual({ permission: "*", pattern: "*", action: "deny" });
    const allows = rules.filter((r) => r.action === "allow");
    const perms = allows.map((r) => r.permission).sort();
    expect(perms).toEqual(["edit", "glob", "grep", "read", "write"]);
    const wsScoped = allows.filter((r) => r.pattern === `${WS}/**`);
    expect(wsScoped.map((r) => r.permission).sort()).toEqual(["edit", "read", "write"]);
    const globalScoped = allows.filter((r) => r.pattern === "*");
    expect(globalScoped.map((r) => r.permission).sort()).toEqual(["glob", "grep"]);
  });

  it("does NOT allow bash (S1)", () => {
    const rules = buildPermissions(WS);
    const bashRules = rules.filter((r) => r.permission === "bash");
    const bashAllows = bashRules.filter((r) => r.action === "allow");
    expect(bashAllows).toHaveLength(0);
  });

  it("appends deny-edit rules for other-owned paths (S2 — no deny-write)", () => {
    const rules = buildPermissions(WS, ["src/index.html", "public/style.css"]);
    const denyWrite = rules.filter(
      (r) => r.permission === "write" && r.action === "deny" && r.pattern !== "*",
    );
    const denyEdit = rules.filter(
      (r) => r.permission === "edit" && r.action === "deny" && r.pattern !== "*",
    );
    expect(denyWrite).toHaveLength(0);
    expect(denyEdit).toHaveLength(2);
    expect(denyEdit[0]!.pattern).toBe(`${WS}/src/index.html`);
    expect(denyEdit[1]!.pattern).toBe(`${WS}/public/style.css`);
  });

  it("deny-other-owned rules come after allows (win via findLast)", () => {
    const rules = buildPermissions(WS, ["a.html"]);
    const lastAllow = rules
      .map((r, i) => ({ ...r, i }))
      .filter((r) => r.action === "allow")
      .pop()!;
    const firstDenyOwned = rules.findIndex(
      (r) => r.action === "deny" && r.pattern !== "*",
    );
    expect(firstDenyOwned).toBeGreaterThan(lastAllow.i);
  });

  it("produces no extra deny rules when otherOwnedPaths is empty", () => {
    const rules = buildPermissions(WS, []);
    const denyNonCatchall = rules.filter((r) => r.action === "deny" && r.pattern !== "*");
    expect(denyNonCatchall).toHaveLength(0);
  });
});

describe("isExcludedSegment", () => {
  it("excludes node_modules, .git, dist, __pycache__, and dotdirs (S4)", () => {
    expect(isExcludedSegment("node_modules")).toBe(true);
    expect(isExcludedSegment(".git")).toBe(true);
    expect(isExcludedSegment("dist")).toBe(true);
    expect(isExcludedSegment("__pycache__")).toBe(true);
    expect(isExcludedSegment(".next")).toBe(true);
    expect(isExcludedSegment(".venv")).toBe(true);
    expect(isExcludedSegment(".cache")).toBe(true);
    expect(isExcludedSegment(".hidden")).toBe(true);
  });

  it("allows normal directories and files", () => {
    expect(isExcludedSegment("src")).toBe(false);
    expect(isExcludedSegment("public")).toBe(false);
    expect(isExcludedSegment("index.html")).toBe(false);
    expect(isExcludedSegment("styles.css")).toBe(false);
  });
});

describe("getChangedPaths", () => {
  it("returns new and modified files", () => {
    const before = new Map([
      ["a.html", 100],
      ["b.css", 200],
    ]);
    const after = new Map([
      ["a.html", 100],
      ["b.css", 300],
      ["c.js", 400],
    ]);
    const changed = getChangedPaths(before, after);
    expect([...changed].sort()).toEqual(["b.css", "c.js"]);
  });

  it("returns empty when nothing changed", () => {
    const snap = new Map([["a.html", 100]]);
    expect(getChangedPaths(snap, snap)).toEqual([]);
  });

  it("returns results in sorted order", () => {
    const before = new Map<string, number>();
    const after = new Map([
      ["z.ts", 100],
      ["a.ts", 200],
      ["m.ts", 300],
    ]);
    expect(getChangedPaths(before, after)).toEqual(["a.ts", "m.ts", "z.ts"]);
  });
});

describe("isSettled", () => {
  it("returns false when current is empty", () => {
    expect(isSettled([], ["a.ts"])).toBe(false);
  });

  it("returns false when both are empty", () => {
    expect(isSettled([], [])).toBe(false);
  });

  it("returns false when lengths differ", () => {
    expect(isSettled(["a.ts"], ["a.ts", "b.ts"])).toBe(false);
  });

  it("returns false when contents differ", () => {
    expect(isSettled(["a.ts", "c.ts"], ["a.ts", "b.ts"])).toBe(false);
  });

  it("returns true when non-empty and identical", () => {
    expect(isSettled(["a.ts", "b.ts"], ["a.ts", "b.ts"])).toBe(true);
  });
});
