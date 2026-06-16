import express from "express";
import type { Server } from "http";
import path from "path";

// Loopback-only host: serving a bundled SPA must never be reachable from the LAN
// (CLAUDE.md security rule — bind 127.0.0.1 ONLY). Used in packaged builds to
// replace the per-app dev servers (Vite / Next) with static file serving.
const LOOPBACK_HOST = "127.0.0.1";

export interface StaticServerHandle {
  readonly server: Server;
  close(): Promise<void>;
}

/**
 * Serve a built static SPA directory on a fixed loopback port with history-API
 * fallback to index.html. Resolves once the socket is listening.
 */
export async function startStaticServer(
  rootDir: string,
  port: number,
): Promise<StaticServerHandle> {
  const indexFile = path.join(rootDir, "index.html");
  const app = express();

  // express.static rejects path traversal by design; serve assets first.
  app.use(express.static(rootDir, { fallthrough: true, index: "index.html" }));

  // SPA fallback: any unmatched GET returns the app shell so client routing works.
  app.get(/.*/, (_req, res) => {
    res.sendFile(indexFile);
  });

  const server = await new Promise<Server>((resolve, reject) => {
    const s = app.listen(port, LOOPBACK_HOST, () => resolve(s));
    s.on("error", reject);
  });

  return {
    server,
    close: () =>
      new Promise<void>((resolve) => {
        server.close(() => resolve());
      }),
  };
}
