#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const docsExamplesDir = join(rootDir, "docs", "echarts", "examples");
const manifestJsonPath = join(rootDir, "demo", "src", "generated", "examples-manifest.json");
const metricsJsonPath = join(rootDir, "demo", "src", "generated", "examples-metrics.json");
const scriptsDir = join(rootDir, "demo", "public", "echarts-scripts");
const assetMapPath = join(rootDir, "demo", "public", "echarts-assets", "asset-map.json");

function toPosix(path) {
  return path.replaceAll("\\", "/");
}

function walkExampleFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkExampleFiles(abs));
      continue;
    }

    const ext = extname(entry.name);
    if ((ext === ".ts" || ext === ".js") && entry.name !== "examples.md") {
      out.push(abs);
    }
  }
  return out;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  const docsFiles = walkExampleFiles(docsExamplesDir)
    .map((abs) => toPosix(relative(rootDir, abs)))
    .sort();

  const manifest = JSON.parse(readFileSync(manifestJsonPath, "utf8"));
  const metrics = JSON.parse(readFileSync(metricsJsonPath, "utf8"));
  const assetMap = JSON.parse(readFileSync(assetMapPath, "utf8"));
  const downloadedAssets = assetMap.downloaded ?? {};

  assert(Array.isArray(manifest), "Manifest must be an array.");
  assert(typeof metrics.total === "number", "Metrics file must include total count.");

  const manifestSourcePaths = manifest.map((entry) => entry.sourcePath).sort();
  assert(
    docsFiles.length === manifest.length,
    `Docs file count (${docsFiles.length}) must equal manifest count (${manifest.length}).`,
  );

  for (let i = 0; i < docsFiles.length; i += 1) {
    assert(
      docsFiles[i] === manifestSourcePaths[i],
      `Manifest source mismatch at index ${i}: expected ${docsFiles[i]}, got ${manifestSourcePaths[i]}.`,
    );
  }

  for (const entry of manifest) {
    const scriptPath = join(scriptsDir, entry.id + ".js");
    assert(existsSync(scriptPath), `Missing transpiled script for ${entry.id}`);

    if (entry.status === "unsupported") {
      assert(entry.unsupportedReason, `Unsupported entry ${entry.id} must include unsupportedReason.`);
    }

    if (entry.missingAssetUrls.length === 0) {
      continue;
    }

    for (const url of entry.missingAssetUrls) {
      assert(
        !downloadedAssets[url],
        `Entry ${entry.id} marks ${url} as missing, but it is present in asset map.`,
      );
    }
  }

  const supported = manifest.filter((entry) => entry.status === "supported").length;
  const unsupported = manifest.filter((entry) => entry.status === "unsupported").length;

  assert(metrics.total === manifest.length, "Metrics total does not match manifest length.");
  assert(metrics.supported === supported, "Metrics supported count does not match manifest.");
  assert(metrics.unsupported === unsupported, "Metrics unsupported count does not match manifest.");

  console.log("✅ Demo parity verification passed.");
  console.log(`   Docs examples: ${docsFiles.length}`);
  console.log(`   Manifest entries: ${manifest.length}`);
  console.log(`   Supported: ${supported}`);
  console.log(`   Unsupported: ${unsupported}`);
  console.log(`   Downloaded assets: ${Object.keys(downloadedAssets).length}`);
}

try {
  main();
} catch (error) {
  console.error("❌ Demo parity verification failed.");
  if (error instanceof Error) {
    console.error(`   ${error.message}`);
  } else {
    console.error(`   ${String(error)}`);
  }
  process.exit(1);
}
