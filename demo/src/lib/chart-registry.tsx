import {
  AreaChart,
  BarChart,
  BoxplotChart,
  CalendarChart,
  CandlestickChart,
  ChordChart,
  CustomChart,
  FunnelChart,
  GaugeChart,
  GeoChart,
  GraphChart,
  HeatmapChart,
  LineChart,
  LinesChart,
  MapChart,
  MatrixChart,
  ParallelChart,
  PieChart,
  PictorialBarChart,
  RadarChart,
  SankeyChart,
  ScatterChart,
  SunburstChart,
  ThemeRiverChart,
  TreeChart,
  TreemapChart,
} from "@devstool/shadcn-echarts";
import type { ComponentType, JSX } from "react";
import type { EChartsCoreOption } from "echarts/core";
import type { ChartComponentKey } from "@/types/examples";

type ChartRenderer = "svg" | "canvas";

type DemoChartProps = {
  option: EChartsCoreOption;
  renderer: ChartRenderer;
  height: string;
};

const CHART_COMPONENTS = {
  AreaChart,
  BarChart,
  BoxplotChart,
  CalendarChart,
  CandlestickChart,
  ChordChart,
  CustomChart,
  FunnelChart,
  GaugeChart,
  GeoChart,
  GraphChart,
  HeatmapChart,
  LineChart,
  LinesChart,
  MapChart,
  MatrixChart,
  ParallelChart,
  PieChart,
  PictorialBarChart,
  RadarChart,
  SankeyChart,
  ScatterChart,
  SunburstChart,
  ThemeRiverChart,
  TreeChart,
  TreemapChart,
};

const BASE_HEIGHT_REM_BY_CATEGORY: Record<string, number> = {
  geo: 34,
  graph: 34,
  tree: 34,
  calendar: 36,
  matrix: 36,
  treemap: 36,
  sankey: 32,
  parallel: 32,
  funnel: 32,
};

export function getPreferredRenderer(exampleId: string, category: string): ChartRenderer {
  if (
    category === "lines" ||
    exampleId.includes("large") ||
    exampleId.includes("1-million") ||
    exampleId.includes("20k")
  ) {
    return "canvas";
  }

  return "svg";
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function getBaseHeightRem(category: string): number {
  return BASE_HEIGHT_REM_BY_CATEGORY[category] ?? 30;
}

function countDataLength(value: unknown): number {
  if (!Array.isArray(value)) {
    return 0;
  }
  return value.length;
}

function getOptionDensityScore(option: EChartsCoreOption | undefined): number {
  if (!option) {
    return 0;
  }

  const optionRecord = option as Record<string, unknown>;
  const seriesList = asArray(optionRecord.series as Record<string, unknown> | Record<string, unknown>[] | undefined);
  const axisList = [
    ...asArray(optionRecord.xAxis as Record<string, unknown> | Record<string, unknown>[] | undefined),
    ...asArray(optionRecord.yAxis as Record<string, unknown> | Record<string, unknown>[] | undefined),
    ...asArray(optionRecord.angleAxis as Record<string, unknown> | Record<string, unknown>[] | undefined),
    ...asArray(optionRecord.radiusAxis as Record<string, unknown> | Record<string, unknown>[] | undefined),
  ];
  const hasPolar = optionRecord.polar !== undefined;
  const angleAxisList = asArray(
    optionRecord.angleAxis as Record<string, unknown> | Record<string, unknown>[] | undefined,
  );
  const titleCount = asArray(optionRecord.title as Record<string, unknown> | Record<string, unknown>[] | undefined)
    .length;
  const legendCount = asArray(
    optionRecord.legend as Record<string, unknown> | Record<string, unknown>[] | undefined,
  ).length;

  let dataPoints = 0;
  for (const series of seriesList) {
    dataPoints += Math.min(120, countDataLength((series as Record<string, unknown>).data));
  }

  let axisLabels = 0;
  for (const axis of axisList) {
    axisLabels += Math.min(80, countDataLength((axis as Record<string, unknown>).data));
  }

  let polarLabels = 0;
  for (const axis of angleAxisList) {
    polarLabels += Math.min(120, countDataLength((axis as Record<string, unknown>).data));
  }

  return (
    seriesList.length * 0.9 +
    Math.min(8, dataPoints / 45) +
    Math.min(5, axisLabels / 35) +
    Math.min(7, polarLabels / 14) +
    (hasPolar ? 2.5 : 0) +
    titleCount * 0.4 +
    legendCount * 0.5
  );
}

export function getAdaptiveHeight(
  category: string,
  option?: EChartsCoreOption,
  viewportHeight?: number,
): string {
  const baseHeightRem = getBaseHeightRem(category);
  const densityScore = getOptionDensityScore(option);
  const densityBoostRem = Math.min(10, Math.round(densityScore * 0.7 * 10) / 10);
  const targetPx = Math.round((baseHeightRem + densityBoostRem) * 16);
  const fallbackViewport =
    typeof window !== "undefined" ? window.innerHeight : 960;
  const maxPx = Math.max(460, Math.floor((viewportHeight ?? fallbackViewport) * 0.84));
  const minPx = 360;
  const resolvedPx = Math.max(minPx, Math.min(targetPx, maxPx));
  return `${resolvedPx}px`;
}

export function getPreferredHeight(category: string): string {
  return `${getBaseHeightRem(category)}rem`;
}

export function renderChartByKey(
  chartComponentKey: ChartComponentKey,
  props: DemoChartProps,
): JSX.Element {
  const Component = CHART_COMPONENTS[chartComponentKey] as ComponentType<{
    option: EChartsCoreOption;
    renderer: ChartRenderer;
    style: {
      height: string;
      width: string;
    };
    preset?: boolean;
  }>;
  return (
    <Component
      option={props.option}
      renderer={props.renderer}
      style={{ height: props.height, width: "100%" }}
      preset={false}
    />
  );
}
