#!/usr/bin/env node

import {
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const manifestPath = join(rootDir, "demo", "src", "generated", "examples-manifest.json");
const assetsRoot = join(rootDir, "demo", "public", "echarts-assets");
const assetMapJsonPath = join(assetsRoot, "asset-map.json");
const assetMapTsPath = join(rootDir, "demo", "src", "generated", "asset-map.ts");

const MAX_BYTES = 20 * 1024 * 1024; // 20MB cap per asset

function sha1(input) {
  return createHash("sha1").update(input).digest("hex").slice(0, 10);
}

function toPublicAssetPath(url) {
  const parsed = new URL(url);
  const cleanPath = parsed.pathname.replace(/^\/+/, "");
  const extension = extname(cleanPath);
  const querySuffix = parsed.search ? `.${sha1(parsed.search)}` : "";
  const basePathWithoutExt = extension
    ? cleanPath.slice(0, -extension.length)
    : cleanPath;
  const fileName = extension
    ? `${basePathWithoutExt}${querySuffix}${extension}`
    : `${cleanPath}${querySuffix}.txt`;

  return `/echarts-assets/${parsed.hostname}/${fileName}`;
}

function toDiskAssetPath(publicAssetPath) {
  return join(rootDir, "demo", "public", publicAssetPath.replace(/^\/+/, ""));
}

function ensureParent(path) {
  mkdirSync(dirname(path), { recursive: true });
}

async function downloadAsset(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const contentLengthHeader = response.headers.get("content-length");
  if (contentLengthHeader) {
    const length = Number(contentLengthHeader);
    if (Number.isFinite(length) && length > MAX_BYTES) {
      throw new Error(`Asset too large (${length} bytes)`);
    }
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.byteLength > MAX_BYTES) {
    throw new Error(`Asset too large (${bytes.byteLength} bytes)`);
  }

  ensureParent(outputPath);
  writeFileSync(outputPath, bytes);
}

function collectUrls(manifest) {
  const allUrls = new Set();
  for (const entry of manifest) {
    for (const url of entry.requiredAssetUrls ?? []) {
      allUrls.add(url);
    }
  }
  return [...allUrls].sort();
}

function writeMapOutputs(downloaded, failed) {
  const payload = {
    generatedAt: new Date().toISOString(),
    downloaded,
    failed,
  };

  writeFileSync(assetMapJsonPath, `${JSON.stringify(payload, null, 2)}\n`);

  const tsSource = `export const EXAMPLE_ASSET_MAP: Record<string, string> = ${JSON.stringify(downloaded, null, 2)} as Record<string, string>;

export const EXAMPLE_ASSET_FAILURES: Record<string, string> = ${JSON.stringify(failed, null, 2)} as Record<string, string>;
`;
  writeFileSync(assetMapTsPath, tsSource);
}

async function main() {
  rmSync(assetsRoot, { recursive: true, force: true });
  mkdirSync(assetsRoot, { recursive: true });

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const urls = collectUrls(manifest);

  const downloaded = {};
  const failed = {};

  for (const url of urls) {
    const publicPath = toPublicAssetPath(url);
    const diskPath = toDiskAssetPath(publicPath);

    try {
      await downloadAsset(url, diskPath);
      // Ensure file is actually present and non-empty.
      const size = statSync(diskPath).size;
      if (size <= 0) {
        rmSync(diskPath, { force: true });
        throw new Error("Downloaded file is empty");
      }
      downloaded[url] = publicPath;
      console.log(`[fetch-demo-assets] downloaded: ${url}`);
    } catch (error) {
      failed[url] = error instanceof Error ? error.message : "Unknown error";
      console.warn(`[fetch-demo-assets] failed: ${url} (${failed[url]})`);
    }
  }

  writeMapOutputs(downloaded, failed);
  console.log(
    `[fetch-demo-assets] complete: ${Object.keys(downloaded).length} downloaded, ${Object.keys(failed).length} failed.`,
  );
}

main();
