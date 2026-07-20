#!/usr/bin/env node
/**
 * Copies apps/tool-launcher-extension → public/extensions/rankmora-launcher
 * and creates public/extensions/rankmora-launcher.zip for user download.
 */
import { cpSync, mkdirSync, rmSync, existsSync } from "fs";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "apps/tool-launcher-extension");
const destDir = path.join(root, "public/extensions/rankmora-launcher");
const zipPath = path.join(root, "public/extensions/rankmora-launcher.zip");

const include = [
  "manifest.json",
  "background.js",
  "content.js",
  "popup.html",
];

mkdirSync(path.dirname(destDir), { recursive: true });
rmSync(destDir, { recursive: true, force: true });
mkdirSync(destDir, { recursive: true });

for (const file of include) {
  cpSync(path.join(src, file), path.join(destDir, file));
}

rmSync(zipPath, { force: true });

const staging = path.join(root, "public/extensions/.zip-staging");
rmSync(staging, { recursive: true, force: true });
mkdirSync(staging, { recursive: true });
const folderName = "rankmora-launcher";
cpSync(destDir, path.join(staging, folderName), { recursive: true });

execSync(
  `cd "${staging}" && zip -r "${zipPath}" "${folderName}" -x "*.DS_Store"`,
  { stdio: "inherit" }
);

rmSync(staging, { recursive: true, force: true });

console.log(`Extension packaged: ${zipPath}`);
