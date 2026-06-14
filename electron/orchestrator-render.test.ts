import { describe, it, expect, beforeEach } from "vitest";
import { promises as realFs } from "fs";
import path from "path";
import os from "os";
import { findRenderProblems } from "./orchestrator-render.js";

describe("findRenderProblems", () => {
  let tmpDir: string;
  beforeEach(async () => {
    tmpDir = await realFs.mkdtemp(path.join(os.tmpdir(), "render-"));
  });

  it("returns [] when there are no served HTML pages (no browser launched)", async () => {
    await realFs.writeFile(path.join(tmpDir, "report.md"), "no html here");
    const out = await findRenderProblems(tmpDir);
    expect(out).toEqual([]);
  });

  it("returns [] for an empty workspace", async () => {
    const out = await findRenderProblems(tmpDir);
    expect(out).toEqual([]);
  });
});
