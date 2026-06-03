import express, { Request, Response, NextFunction } from "express";
import { randomBytes } from "crypto";
import { readAllApiKeys } from "../keychain.js";

const PROXY_PORT = 9999;
const PROXY_HOST = "127.0.0.1";

export async function startProxy(): Promise<string> {
  const sessionToken = randomBytes(32).toString("hex");

  const app = express();
  app.use(express.json({ limit: "10mb" }));

  // Strict auth — every request must carry the session token
  app.use((req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers["authorization"] ?? "";
    if (!auth.startsWith("Bearer ") || auth.slice(7) !== sessionToken) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    next();
  });

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.get("/v1/models", async (_req, res) => {
    const keys = await readAllApiKeys();
    res.json({ object: "list", data: buildModelList(keys) });
  });

  app.post("/v1/chat/completions", async (req: Request, res: Response) => {
    try {
      const keys = await readAllApiKeys();
      const { model, ...rest } = req.body as { model: string; [k: string]: unknown };
      const { targetUrl, headers } = resolveRoute(model, keys);

      const upstream = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ model, ...rest }),
      });

      res.status(upstream.status);
      upstream.headers.forEach((v, k) => res.setHeader(k, v));
      upstream.body?.pipeTo(
        new WritableStream({
          write: (chunk) => {
            res.write(chunk);
          },
          close: () => {
            res.end();
          },
        }),
      );
    } catch (err) {
      console.error("[proxy]", err);
      res.status(502).json({ error: "Bad gateway" });
    }
  });

  await new Promise<void>((resolve) => {
    app.listen(PROXY_PORT, PROXY_HOST, () => resolve());
  });

  console.warn(`[proxy] listening on ${PROXY_HOST}:${PROXY_PORT}`);
  return sessionToken;
}

function resolveRoute(
  model: string,
  keys: Awaited<ReturnType<typeof readAllApiKeys>>,
): { targetUrl: string; headers: Record<string, string> } {
  if (model.startsWith("claude-")) {
    return {
      targetUrl: "https://api.anthropic.com/v1/messages",
      headers: { "x-api-key": keys.anthropic ?? "", "anthropic-version": "2023-06-01" },
    };
  }
  if (model.startsWith("gpt-") || model.startsWith("o1") || model.startsWith("o3")) {
    return {
      targetUrl: "https://api.openai.com/v1/chat/completions",
      headers: { Authorization: `Bearer ${keys.openai ?? ""}` },
    };
  }
  return { targetUrl: `${keys.ollamaUrl}/v1/chat/completions`, headers: {} };
}

function buildModelList(
  keys: Awaited<ReturnType<typeof readAllApiKeys>>,
): Array<{ id: string; object: string }> {
  const models: string[] = [];
  if (keys.anthropic)
    models.push("claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5");
  if (keys.openai) models.push("gpt-4o", "gpt-4o-mini", "o3-mini");
  models.push("llama3", "mistral", "phi3");
  return models.map((id) => ({ id, object: "model" }));
}
