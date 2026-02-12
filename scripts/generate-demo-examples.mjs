#!/usr/bin/env node

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");
const examplesDir = join(rootDir, "docs", "echarts", "examples");
const generatedDir = join(rootDir, "demo", "src", "generated");
const scriptsOutDir = join(rootDir, "demo", "public", "echarts-scripts");
const assetMapPath = join(rootDir, "demo", "public", "echarts-assets", "asset-map.json");

const REMOTE_ROOT = "https://echarts.apache.org/examples";

const CATEGORY_COMPONENT_MAP = {
  bar: "BarChart",
  boxplot: "BoxplotChart",
  calendar: "CalendarChart",
  candlestick: "CandlestickChart",
  chord: "ChordChart",
  funnel: "FunnelChart",
  gauge: "GaugeChart",
  geo: "GeoChart",
  graph: "GraphChart",
  heatmap: "HeatmapChart",
  line: "LineChart",
  lines: "LinesChart",
  matrix: "MatrixChart",
  parallel: "ParallelChart",
  pie: "PieChart",
  radar: "RadarChart",
  sankey: "SankeyChart",
  scatter: "ScatterChart",
  sunburst: "SunburstChart",
  themeriver: "ThemeRiverChart",
  tree: "TreeChart",
  treemap: "TreemapChart",
};

const UNMAPPED_CATEGORIES = new Set(["graphic"]);

const IMPERATIVE_RUNTIME_PATTERNS = [
  /\bmyChart\.on\s*\(/,
  /\bmyChart\.off\s*\(/,
  /\bmyChart\.dispatchAction\s*\(/,
  /\bmyChart\.appendData\s*\(/,
  /\bgetZr\s*\(\s*\)\.on\s*\(/,
  /\bzr\.on\s*\(/,
  /\bdocument\.addEventListener\s*\(/,
  /\bwindow\.addEventListener\s*\(/,
  /\bsetInterval\s*\(/,
  /\brequestAnimationFrame\s*\(/,
];

function toPosix(path) {
  return path.replaceAll("\\", "/");
}

function walkFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(abs));
      continue;
    }

    const ext = extname(entry.name);
    if ((ext === ".ts" || ext === ".js") && entry.name !== "examples.md") {
      out.push(abs);
    }
  }
  return out;
}

function stripCommentPrefix(source) {
  return source
    .split(/\r?\n/g)
    .map((line) => line.replace(/^\s*\/\/\s?/, ""))
    .join("\n");
}

function stripModuleSyntax(source, fileName) {
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.ESNext,
    true,
    fileName.endsWith(".js") ? ts.ScriptKind.JS : ts.ScriptKind.TS,
  );

  const keepStatements = sourceFile.statements.filter(
    (statement) =>
      !ts.isImportDeclaration(statement) &&
      !ts.isExportDeclaration(statement) &&
      !ts.isExportAssignment(statement),
  );

  if (keepStatements.length === sourceFile.statements.length) {
    return source;
  }

  return keepStatements.map((statement) => source.slice(statement.pos, statement.end)).join("\n");
}

function titleFromSlug(slug) {
  return slug
    .replaceAll("-", " ")
    .replaceAll("  ", " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function inferChartComponent(category, slug) {
  if (UNMAPPED_CATEGORIES.has(category)) {
    return null;
  }

  if (category === "line") {
    if (slug.includes("area")) {
      return "AreaChart";
    }
    return "LineChart";
  }

  if (category === "bar") {
    if (slug.includes("pictorial")) {
      return "PictorialBarChart";
    }
    return "BarChart";
  }

  return CATEGORY_COMPONENT_MAP[category] ?? null;
}

function inferExecutionMode(source) {
  const imperative = IMPERATIVE_RUNTIME_PATTERNS.some((pattern) => pattern.test(source));
  return imperative ? "imperative-runtime" : "static-option";
}

function normalizeUrlString(raw) {
  let value = raw.trim();
  value = value.replace(/[),.;]+$/, "");
  return value;
}

function shouldKeepRemoteUrl(url) {
  if (url.includes("/data/asset/")) {
    return true;
  }

  return /\.(json|geojson|geo\.json|svg|csv|bin|png|js)(\?|$)/i.test(url);
}

function extractRemoteUrls(source) {
  const urls = new Set();

  for (const match of source.matchAll(/https?:\/\/[^\s"'`]+/g)) {
    const normalized = normalizeUrlString(match[0]);
    if (shouldKeepRemoteUrl(normalized)) {
      urls.add(normalized);
    }
  }

  for (const match of source.matchAll(/['"`](\/data\/asset\/[^'"`]+)['"`]/g)) {
    const absolute = `${REMOTE_ROOT}${match[1]}`;
    if (shouldKeepRemoteUrl(absolute)) {
      urls.add(absolute);
    }
  }

  return [...urls].sort();
}

function transpileSource(source, fileName) {
  const result = ts.transpileModule(source, {
    fileName,
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.Preserve,
      removeComments: false,
    },
    reportDiagnostics: true,
  });

  const diagnostics = result.diagnostics ?? [];
  const errors = diagnostics
    .filter((d) => d.category === ts.DiagnosticCategory.Error)
    .map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n"));

  return {
    outputText: result.outputText,
    errors,
  };
}

function readAssetMap() {
  try {
    return JSON.parse(readFileSync(assetMapPath, "utf8"));
  } catch {
    return {
      downloaded: {},
    };
  }
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeTypeScriptManifest(entries, metrics) {
  const manifestTsPath = join(generatedDir, "examples-manifest.ts");
  const metricsTsPath = join(generatedDir, "examples-metrics.ts");
  const categoryList = [...new Set(entries.map((entry) => entry.category))].sort();

  const manifestSource = `import type { ExampleCatalogEntry } from "@/types/examples";

export const EXAMPLE_MANIFEST: ExampleCatalogEntry[] = ${JSON.stringify(entries, null, 2)} as ExampleCatalogEntry[];

export const EXAMPLE_CATEGORY_LIST = ${JSON.stringify(categoryList, null, 2)} as const;

export const EXAMPLE_BY_ID: Record<string, ExampleCatalogEntry> = Object.fromEntries(
  EXAMPLE_MANIFEST.map((entry) => [entry.id, entry]),
);
`;

  const metricsSource = `import type { ExampleCatalogMetrics } from "@/types/examples";

export const EXAMPLE_METRICS: ExampleCatalogMetrics = ${JSON.stringify(metrics, null, 2)} as ExampleCatalogMetrics;
`;

  writeFileSync(manifestTsPath, manifestSource);
  writeFileSync(metricsTsPath, metricsSource);
}

function buildMetrics(entries) {
  const statusCounts = {
    supported: 0,
    unsupported: 0,
  };

  const byCategory = {};
  for (const entry of entries) {
    statusCounts[entry.status] += 1;

    if (!byCategory[entry.category]) {
      byCategory[entry.category] = {
        total: 0,
        supported: 0,
        unsupported: 0,
      };
    }

    byCategory[entry.category].total += 1;
    byCategory[entry.category][entry.status] += 1;
  }

  return {
    generatedAt: new Date().toISOString(),
    total: entries.length,
    supported: statusCounts.supported,
    unsupported: statusCounts.unsupported,
    byCategory,
  };
}

function main() {
  mkdirSync(generatedDir, { recursive: true });
  rmSync(scriptsOutDir, { recursive: true, force: true });
  mkdirSync(scriptsOutDir, { recursive: true });

  const assetMap = readAssetMap();
  const assetLookup = assetMap.downloaded ?? {};
  const files = walkFiles(examplesDir)
    .map((file) => ({
      abs: file,
      rel: toPosix(relative(examplesDir, file)),
    }))
    .sort((a, b) => a.rel.localeCompare(b.rel));

  const entries = [];

  for (const item of files) {
    const ext = extname(item.rel);
    const sourcePath = toPosix(join("docs", "echarts", "examples", item.rel));
    const relNoExt = item.rel.slice(0, -ext.length);
    const slug = relNoExt.split("/").at(-1) ?? relNoExt;
    const category = relNoExt.split("/")[0] ?? "unknown";
    const id = relNoExt;
    const title = titleFromSlug(slug);

    const rawSource = readFileSync(item.abs, "utf8");
    const normalizedSource = stripCommentPrefix(rawSource);
    const executableSource = stripModuleSyntax(normalizedSource, item.rel);
    const remoteUrls = extractRemoteUrls(executableSource);
    const transpiled = transpileSource(executableSource, sourcePath);
    const executionMode = inferExecutionMode(executableSource);
    const scriptPath = `/echarts-scripts/${relNoExt}.js`;
    const scriptOut = join(scriptsOutDir, `${relNoExt}.js`);
    mkdirSync(dirname(scriptOut), { recursive: true });
    writeFileSync(scriptOut, transpiled.outputText);

    const chartComponent = inferChartComponent(category, slug);
    const missingAssetUrls = remoteUrls.filter((url) => !assetLookup[url]);

    let status = "supported";
    let unsupportedReason = null;

    if (!chartComponent) {
      status = "unsupported";
      unsupportedReason = "no-component-mapping";
    } else if (transpiled.errors.length > 0) {
      status = "unsupported";
      unsupportedReason = "transpile-failed";
    } else if (missingAssetUrls.length > 0) {
      status = "unsupported";
      unsupportedReason = "missing-local-assets";
    }

    entries.push({
      id,
      slug,
      title,
      category,
      sourcePath: toPosix(sourcePath),
      scriptPath,
      extension: ext.slice(1),
      chartComponent,
      executionMode,
      status,
      unsupportedReason,
      transpileErrors: transpiled.errors,
      requiredAssetUrls: remoteUrls,
      missingAssetUrls,
    });
  }

  const metrics = buildMetrics(entries);
  writeJson(join(generatedDir, "examples-manifest.json"), entries);
  writeJson(join(generatedDir, "examples-metrics.json"), metrics);
  writeTypeScriptManifest(entries, metrics);

  console.log(
    `[generate-demo-examples] Generated ${entries.length} entries (${metrics.supported} supported, ${metrics.unsupported} unsupported).`,
  );
}

main();
