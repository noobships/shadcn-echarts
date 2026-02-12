#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const sourceRegistryPath = join(rootDir, "registry.json");
const publicRegistryPath = join(rootDir, "apps", "www", "public", "registry.json");
const registryOutputDir = join(rootDir, "apps", "www", "public", "r");

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

if (!existsSync(sourceRegistryPath)) {
  fail("Root registry.json is missing.");
}

if (!existsSync(publicRegistryPath)) {
  fail("Missing apps/www/public/registry.json. Run `pnpm registry:build` first.");
}

if (!existsSync(registryOutputDir)) {
  fail("Missing apps/www/public/r output directory. Run `pnpm registry:build` first.");
}

const registry = JSON.parse(readFileSync(sourceRegistryPath, "utf8"));
if (!Array.isArray(registry.items)) {
  fail("registry.json does not contain a valid items array.");
}

const missing = [];
for (const item of registry.items) {
  const itemName = item?.name;
  if (!itemName || typeof itemName !== "string") {
    missing.push("<invalid-item-name>");
    continue;
  }

  const itemPath = join(registryOutputDir, `${itemName}.json`);
  if (!existsSync(itemPath)) {
    missing.push(itemName);
  }
}

if (missing.length > 0) {
  fail(
    `Missing ${missing.length} built registry items in apps/www/public/r: ${missing.join(", ")}`
  );
}

console.log(`✅ Registry assets verified (${registry.items.length} items).`);
