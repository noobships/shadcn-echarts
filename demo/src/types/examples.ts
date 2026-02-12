export type ExampleStatus = "supported" | "unsupported";
export type ExampleExecutionMode = "static-option" | "imperative-runtime";

export type UnsupportedReason =
  | "no-component-mapping"
  | "transpile-failed"
  | "missing-local-assets"
  | "runtime-evaluation-failed"
  | "missing-option";

export type ChartComponentKey =
  | "AreaChart"
  | "BarChart"
  | "BoxplotChart"
  | "CalendarChart"
  | "CandlestickChart"
  | "ChordChart"
  | "CustomChart"
  | "FunnelChart"
  | "GaugeChart"
  | "GeoChart"
  | "GraphChart"
  | "HeatmapChart"
  | "LineChart"
  | "LinesChart"
  | "MapChart"
  | "MatrixChart"
  | "ParallelChart"
  | "PieChart"
  | "PictorialBarChart"
  | "RadarChart"
  | "SankeyChart"
  | "ScatterChart"
  | "SunburstChart"
  | "ThemeRiverChart"
  | "TreeChart"
  | "TreemapChart";

export interface ExampleCatalogEntry {
  id: string;
  slug: string;
  title: string;
  category: string;
  sourcePath: string;
  scriptPath: string;
  extension: "ts" | "js";
  chartComponent: ChartComponentKey | null;
  executionMode: ExampleExecutionMode;
  status: ExampleStatus;
  unsupportedReason: UnsupportedReason | null;
  transpileErrors: string[];
  requiredAssetUrls: string[];
  missingAssetUrls: string[];
}

export interface ExampleCatalogMetrics {
  generatedAt: string;
  total: number;
  supported: number;
  unsupported: number;
  byCategory: Record<
    string,
    {
      total: number;
      supported: number;
      unsupported: number;
    }
  >;
}
