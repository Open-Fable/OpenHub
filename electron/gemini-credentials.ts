// Gemini CLI "installed app" OAuth credentials.
//
// These identify the APPLICATION to Google — they are NOT personal user data.
// They are the public values published by upstream gemini-cli (Google documents
// that an installed-app "client secret" is not confidential). Each end user still
// logs in with their own Google account; their refresh token stays local in
// ~/.local/share/opencode/auth.json and is never bundled.
//
// They are sourced ONLY from env vars (an .env loaded in dev, or your own OAuth
// client) — never hardcoded in source. When unset, both resolve to "" and the
// Gemini OAuth route is disabled (see gemini-oauth.ts / proxy/index.ts). Get the
// public values from the upstream gemini-cli project (see .env.example).
import fs from "fs";
import path from "path";
import os from "os";

function loadEnvSync() {
  const paths = [
    path.join(os.homedir(), ".config", "openhub", ".env"),
    path.join(os.homedir(), "Documents", "Application", "OpenHub", ".env"),
  ];

  for (const p of paths) {
    try {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, "utf-8");
        for (const line of content.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const index = trimmed.indexOf("=");
          if (index === -1) continue;
          const key = trimmed.slice(0, index).trim();
          const val = trimmed
            .slice(index + 1)
            .trim()
            .replace(/^['"]|['"]$/g, "");
          if (key && !process.env[key]) {
            process.env[key] = val;
          }
        }
        break;
      }
    } catch {
      // ignore
    }
  }
}

loadEnvSync();

export const GEMINI_CLIENT_ID = process.env.GEMINI_CLIENT_ID || "";
export const GEMINI_CLIENT_SECRET = process.env.GEMINI_CLIENT_SECRET || "";
