const fs = require("fs");
const path = require("path");

const srcDir = process.argv[2];
const dstDir = process.argv[3];

if (!srcDir || !dstDir) {
  console.error("Usage: node flatten-node-modules.cjs <src_dir> <dst_dir>");
  process.exit(1);
}

// Ensure output directory exists
fs.mkdirSync(dstDir, { recursive: true });

const processedPaths = new Set();

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    const lstats = fs.lstatSync(src);
    if (lstats.isSymbolicLink()) {
      try {
        fs.copyFileSync(src, dest);
        const fileStats = fs.statSync(src);
        fs.chmodSync(dest, fileStats.mode);
      } catch (err) {
        const real = fs.realpathSync(src);
        const realStats = fs.statSync(real);
        if (realStats.isDirectory()) {
          copyRecursiveSync(real, dest);
        } else {
          fs.copyFileSync(real, dest);
          fs.chmodSync(dest, realStats.mode);
        }
      }
    } else {
      fs.copyFileSync(src, dest);
      fs.chmodSync(dest, stats.mode);
    }
  }
}

function processPkg(pkgName, pkgSrcPath) {
  let realPath;
  try {
    realPath = fs.realpathSync(pkgSrcPath);
  } catch (err) {
    return; // Dead link or missing package
  }

  if (processedPaths.has(realPath)) {
    return;
  }
  processedPaths.add(realPath);

  console.log(`[flatten] Processing ${pkgName} -> ${realPath}`);

  const destPath = path.join(dstDir, pkgName);

  // Copy package folder recursively
  copyRecursiveSync(realPath, destPath);

  // Resolve dependencies via pnpm virtual store structure
  const isScoped = pkgName.startsWith("@");
  const virtualNmDir = isScoped ? path.dirname(path.dirname(realPath)) : path.dirname(realPath);

  if (fs.existsSync(virtualNmDir) && path.basename(virtualNmDir) === "node_modules") {
    // Read the siblings (dependencies of this package)
    const entries = fs.readdirSync(virtualNmDir);
    for (const entry of entries) {
      if (entry === pkgName || entry === "." || entry === "..") continue;

      const entryPath = path.join(virtualNmDir, entry);
      if (entry.startsWith("@")) {
        const subEntries = fs.readdirSync(entryPath);
        for (const subEntry of subEntries) {
          const subPkgName = `${entry}/${subEntry}`;
          if (subPkgName === pkgName) continue;
          processPkg(subPkgName, path.join(entryPath, subEntry));
        }
      } else {
        processPkg(entry, entryPath);
      }
    }
  }

  // Also scan local package node_modules if present (for workspace packages)
  const localNm = path.join(realPath, "node_modules");
  if (fs.existsSync(localNm)) {
    const entries = fs.readdirSync(localNm);
    for (const entry of entries) {
      if (entry === "." || entry === "..") continue;
      const entryPath = path.join(localNm, entry);
      if (entry.startsWith("@")) {
        const subEntries = fs.readdirSync(entryPath);
        for (const subEntry of subEntries) {
          processPkg(`${entry}/${subEntry}`, path.join(entryPath, subEntry));
        }
      } else {
        processPkg(entry, entryPath);
      }
    }
  }
}

// Start processing from all packages inside source node_modules
if (fs.existsSync(srcDir)) {
  const entries = fs.readdirSync(srcDir);
  for (const entry of entries) {
    if (entry === ".bin" || entry === "." || entry === "..") continue;
    const entryPath = path.join(srcDir, entry);
    if (entry.startsWith("@")) {
      const subEntries = fs.readdirSync(entryPath);
      for (const subEntry of subEntries) {
        processPkg(`${entry}/${subEntry}`, path.join(entryPath, subEntry));
      }
    } else {
      processPkg(entry, entryPath);
    }
  }
}

console.log("[flatten] Done! All production dependencies copied and flattened successfully.");
