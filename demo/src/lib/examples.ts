import { EXAMPLE_CATEGORY_LIST, EXAMPLE_MANIFEST } from "@/generated/examples-manifest";
import { EXAMPLE_METRICS } from "@/generated/examples-metrics";
import type { ExampleCatalogEntry, ExampleStatus } from "@/types/examples";

export const CATEGORY_LABELS: Record<string, string> = {
  bar: "Bar",
  boxplot: "Boxplot",
  calendar: "Calendar",
  candlestick: "Candlestick",
  chord: "Chord",
  funnel: "Funnel",
  gauge: "Gauge",
  geo: "Geo & Map",
  graph: "Graph",
  graphic: "Graphic",
  heatmap: "Heatmap",
  line: "Line & Area",
  lines: "Lines",
  matrix: "Matrix",
  parallel: "Parallel",
  pie: "Pie",
  radar: "Radar",
  sankey: "Sankey",
  scatter: "Scatter",
  sunburst: "Sunburst",
  themeriver: "Theme River",
  tree: "Tree",
  treemap: "Treemap",
};

export const ALL_EXAMPLES = EXAMPLE_MANIFEST;
export const EXAMPLE_COUNTS = EXAMPLE_METRICS;
export const CATEGORIES = EXAMPLE_CATEGORY_LIST;

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

export function getExamplesByCategory(category: string): ExampleCatalogEntry[] {
  return ALL_EXAMPLES.filter((entry) => entry.category === category);
}

export function findExampleById(id: string): ExampleCatalogEntry | undefined {
  return ALL_EXAMPLES.find((entry) => entry.id === id);
}

export function filterExamples(params: {
  category?: string;
  query?: string;
  status?: "all" | ExampleStatus;
}): ExampleCatalogEntry[] {
  const query = params.query?.trim().toLowerCase() ?? "";
  const status = params.status ?? "all";

  return ALL_EXAMPLES.filter((entry) => {
    if (params.category && entry.category !== params.category) {
      return false;
    }

    if (status !== "all" && entry.status !== status) {
      return false;
    }

    if (!query) {
      return true;
    }

    return (
      entry.title.toLowerCase().includes(query) ||
      entry.id.toLowerCase().includes(query) ||
      entry.sourcePath.toLowerCase().includes(query)
    );
  });
}

export function toExampleRoute(id: string): string {
  return `/examples/${encodeURIComponent(id)}`;
}
