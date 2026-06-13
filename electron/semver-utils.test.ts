import { describe, expect, test } from "vitest";
import { parseSemver, compareSemver, findLatestTag } from "./semver-utils.js";

describe("parseSemver", () => {
  test("parses an opencode tag with v prefix", () => {
    expect(parseSemver("v1.2.3", "opencode")).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: undefined,
    });
  });

  test("parses an open-design prefixed tag", () => {
    expect(parseSemver("open-design-v0.4.10", "open-design")).toEqual({
      major: 0,
      minor: 4,
      patch: 10,
      prerelease: undefined,
    });
  });

  test("captures the prerelease segment", () => {
    expect(parseSemver("v2.0.0-beta.1", "openwork")).toEqual({
      major: 2,
      minor: 0,
      patch: 0,
      prerelease: "beta.1",
    });
  });

  test("rejects opencode vscode-prefixed tags", () => {
    expect(parseSemver("vscode-1.0.0", "opencode")).toBeNull();
  });

  test("rejects openwork dev and orchestrator tags", () => {
    expect(parseSemver("v1.0.0-dev", "openwork")).toBeNull();
    expect(parseSemver("openwork-orchestrator-1.0.0", "openwork")).toBeNull();
    expect(parseSemver("openwrk-1.0.0", "openwork")).toBeNull();
  });

  test("returns null for an unknown app", () => {
    expect(parseSemver("v1.0.0", "unknown")).toBeNull();
  });

  test("returns null for a non-semver tag", () => {
    expect(parseSemver("latest", "opencode")).toBeNull();
  });
});

describe("compareSemver", () => {
  test("orders by major, then minor, then patch", () => {
    const a = { major: 1, minor: 0, patch: 0 };
    const b = { major: 0, minor: 9, patch: 9 };
    expect(compareSemver(a, b)).toBeGreaterThan(0);
    expect(compareSemver(b, a)).toBeLessThan(0);
  });

  test("treats a prerelease as lower than its release", () => {
    const release = { major: 1, minor: 0, patch: 0 };
    const pre = { major: 1, minor: 0, patch: 0, prerelease: "rc.1" };
    expect(compareSemver(pre, release)).toBeLessThan(0);
    expect(compareSemver(release, pre)).toBeGreaterThan(0);
  });

  test("returns 0 for equal versions", () => {
    const v = { major: 3, minor: 1, patch: 4 };
    expect(compareSemver(v, { ...v })).toBe(0);
  });
});

describe("findLatestTag", () => {
  test("returns the highest valid tag, ignoring invalid ones", () => {
    const tags = ["v1.0.0", "vscode-9.9.9", "v1.3.0", "v1.2.5"];
    expect(findLatestTag(tags, "opencode")).toBe("v1.3.0");
  });

  test("returns 'none' when no tag is valid", () => {
    expect(findLatestTag(["nightly", "latest"], "opencode")).toBe("none");
  });
});
