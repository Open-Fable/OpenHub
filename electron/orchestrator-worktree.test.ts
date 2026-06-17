import { describe, expect, it } from "vitest";
import { promises as fs } from "node:fs";
import { tmpdir, homedir } from "node:os";
import path from "node:path";
import {
  isScratchWorkspace,
  isScratchWorkspaceReal,
  isGitAvailable,
  ensureGitBaseline,
  addWorktree,
  commitWorktree,
  mergeWorktree,
  removeWorktree,
} from "./orchestrator-worktree.js";

async function withRepo<T>(fn: (dir: string) => Promise<T>): Promise<T> {
  const dir = await fs.mkdtemp(path.join(tmpdir(), "oh-wt-"));
  try {
    return await fn(dir);
  } finally {
    await fs.rm(`${dir}.worktrees`, { recursive: true, force: true }).catch(() => {});
    await fs.rm(dir, { recursive: true, force: true });
  }
}

const write = (dir: string, rel: string, body: string): Promise<void> =>
  fs.writeFile(path.join(dir, rel), body, "utf-8");
const read = (dir: string, rel: string): Promise<string> =>
  fs.readFile(path.join(dir, rel), "utf-8");

describe("isScratchWorkspace", () => {
  it("accepts paths strictly inside ~/_orch/", () => {
    expect(isScratchWorkspace(path.join(homedir(), "_orch", "MySite"))).toBe(true);
    expect(isScratchWorkspace(path.join(homedir(), "_orch", "a", "b"))).toBe(true);
  });

  it("rejects the scratch root itself, home, and outside paths", () => {
    expect(isScratchWorkspace(path.join(homedir(), "_orch"))).toBe(false);
    expect(isScratchWorkspace(homedir())).toBe(false);
    expect(isScratchWorkspace("/tmp/whatever")).toBe(false);
    expect(isScratchWorkspace(path.join(homedir(), "Projects", "real"))).toBe(false);
  });
});

describe("isScratchWorkspaceReal (symlink-aware guard)", () => {
  it("rejects paths outside ~/_orch", async () => {
    expect(await isScratchWorkspaceReal("/tmp/whatever")).toBe(false);
    expect(await isScratchWorkspaceReal(homedir())).toBe(false);
  });

  it("rejects a non-existent scratch path (realpath fails → not safe)", async () => {
    const ghost = path.join(homedir(), "_orch", "oh-does-not-exist-xyz-test");
    expect(await isScratchWorkspaceReal(ghost)).toBe(false);
  });
});

describe("git worktree lifecycle", () => {
  it("git is available in this environment", async () => {
    expect(await isGitAvailable()).toBe(true);
  });

  it("merges disjoint agent outputs back into the main workspace", async () => {
    await withRepo(async (main) => {
      await write(main, "shared.txt", "baseline");
      await ensureGitBaseline(main);

      const a = await addWorktree(main, "agent-A");
      const b = await addWorktree(main, "agent-B");
      await write(a.dir, "a.txt", "from A");
      await write(b.dir, "b.txt", "from B");

      expect(await commitWorktree(a)).toBe(true);
      expect(await commitWorktree(b)).toBe(true);

      const ma = await mergeWorktree(main, a);
      const mb = await mergeWorktree(main, b);
      expect(ma.ok).toBe(true);
      expect(mb.ok).toBe(true);

      expect(await read(main, "a.txt")).toBe("from A");
      expect(await read(main, "b.txt")).toBe("from B");

      await removeWorktree(main, a);
      await removeWorktree(main, b);
      await expect(fs.access(a.dir)).rejects.toThrow();
    });
  });

  it("reports a conflict and leaves main untouched, never silently dropping", async () => {
    await withRepo(async (main) => {
      await write(main, "page.html", "<h1>base</h1>");
      await ensureGitBaseline(main);

      const a = await addWorktree(main, "A");
      const b = await addWorktree(main, "B");
      await write(a.dir, "page.html", "<h1>A version</h1>");
      await write(b.dir, "page.html", "<h1>B version</h1>");
      await commitWorktree(a);
      await commitWorktree(b);

      const ma = await mergeWorktree(main, a);
      expect(ma.ok).toBe(true);
      expect(await read(main, "page.html")).toBe("<h1>A version</h1>");

      // B touches the same file from the same base → conflict, abort, no drop.
      const mb = await mergeWorktree(main, b);
      expect(mb.ok).toBe(false);
      expect(mb.conflicts).toContain("page.html");
      // Main still holds A's merged version; nothing half-written.
      expect(await read(main, "page.html")).toBe("<h1>A version</h1>");

      await removeWorktree(main, a);
      await removeWorktree(main, b);
    });
  });

  it("commitWorktree returns false when the agent wrote nothing", async () => {
    await withRepo(async (main) => {
      await ensureGitBaseline(main);
      const a = await addWorktree(main, "idle");
      expect(await commitWorktree(a)).toBe(false);
      await removeWorktree(main, a);
    });
  });
});
