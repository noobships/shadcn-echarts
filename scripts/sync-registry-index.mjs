#!/usr/bin/env node

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const sourceRegistryPath = join(rootDir, "registry.json");
const targetRegistryPath = join(rootDir, "apps", "www", "public", "registry.json");

if (!existsSync(sourceRegistryPath)) {
  console.error("❌ Missing registry.json in project root.");
  process.exit(1);
}

mkdirSync(dirname(targetRegistryPath), { recursive: true });
copyFileSync(sourceRegistryPath, targetRegistryPath);

console.log(`✅ Synced registry index to ${targetRegistryPath}`);
