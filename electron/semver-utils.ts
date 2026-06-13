// Parsing et comparaison sémantique des tags de version des 3 apps upstream.
// Extrait de main.ts : logique pure, sans état partagé, testable isolément.

export interface Semver {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
}

export function parseSemver(tag: string, appName: string): Semver | null {
  let versionStr = tag;
  if (appName === "open-design") {
    const match = tag.match(/^open-design-v?(\d+\.\d+\.\d+(?:-[\w.]+)?)$/);
    if (!match) return null;
    versionStr = match[1];
  } else if (appName === "opencode") {
    if (tag.startsWith("vscode-")) return null;
    const match = tag.match(/^v?(\d+\.\d+\.\d+(?:-[\w.]+)?)$/);
    if (!match) return null;
    versionStr = match[1];
  } else if (appName === "openwork") {
    if (
      tag.includes("-dev") ||
      tag.startsWith("openwork-orchestrator-") ||
      tag.startsWith("openwrk-")
    )
      return null;
    const match = tag.match(/^v?(\d+\.\d+\.\d+(?:-[\w.]+)?)$/);
    if (!match) return null;
    versionStr = match[1];
  } else {
    return null;
  }

  const parts = versionStr.split("-");
  const mainParts = parts[0].split(".");
  if (mainParts.length !== 3) return null;

  const major = parseInt(mainParts[0], 10);
  const minor = parseInt(mainParts[1], 10);
  const patch = parseInt(mainParts[2], 10);
  if (isNaN(major) || isNaN(minor) || isNaN(patch)) return null;

  return {
    major,
    minor,
    patch,
    prerelease: parts[1] || undefined,
  };
}

export function compareSemver(a: Semver, b: Semver): number {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  if (a.patch !== b.patch) return a.patch - b.patch;

  if (a.prerelease && !b.prerelease) return -1;
  if (!a.prerelease && b.prerelease) return 1;
  if (a.prerelease && b.prerelease) {
    return a.prerelease.localeCompare(b.prerelease);
  }
  return 0;
}

export function findLatestTag(tags: string[], appName: string): string {
  let latestTag = "none";
  let latestSemver: Semver | null = null;

  for (const tag of tags) {
    const parsed = parseSemver(tag, appName);
    if (!parsed) continue;

    if (!latestSemver || compareSemver(parsed, latestSemver) > 0) {
      latestSemver = parsed;
      latestTag = tag;
    }
  }

  return latestTag;
}
