import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  AreaChart,
  CandlestickChart,
  RadarChart,
  BoxplotChart,
  HeatmapChart,
  GraphChart,
  TreeChart,
  TreemapChart,
  SunburstChart,
  ParallelChart,
  SankeyChart,
  FunnelChart,
  GaugeChart,
  PictorialBarChart,
  ThemeRiverChart,
  CalendarChart,
  MatrixChart,
  CustomChart,
} from "@devstool/shadcn-echarts";
import type * as React from "react";
import type { ChartExample } from "./chartExamples";

export const chartComponents: Record<
  string,
  (props: { option: ChartExample["option"] }) => React.JSX.Element
> = {
  // Line & Area
  "line-chart": ({ option }) => (
    <LineChart option={option as any} renderer="svg" />
  ),
  "multi-line-chart": ({ option }) => (
    <LineChart option={option as any} renderer="svg" />
  ),
  "smooth-line-chart": ({ option }) => (
    <LineChart option={option as any} renderer="svg" />
  ),
  "step-line-chart": ({ option }) => (
    <LineChart option={option as any} renderer="svg" />
  ),
  "area-chart": ({ option }) => (
    <AreaChart option={option as any} renderer="svg" />
  ),
  "stacked-area-chart": ({ option }) => (
    <AreaChart option={option as any} renderer="svg" />
  ),
  "gradient-area-chart": ({ option }) => (
    <AreaChart option={option as any} renderer="svg" />
  ),

  // Bar
  "bar-chart": ({ option }) => (
    <BarChart option={option as any} renderer="svg" />
  ),
  "grouped-bar-chart": ({ option }) => (
    <BarChart option={option as any} renderer="svg" />
  ),
  "stacked-bar-chart": ({ option }) => (
    <BarChart option={option as any} renderer="svg" />
  ),
  "horizontal-bar-chart": ({ option }) => (
    <BarChart option={option as any} renderer="svg" />
  ),
  "pictorial-bar-chart": ({ option }) => (
    <PictorialBarChart option={option as any} renderer="svg" />
  ),

  // Pie & Donut
  "pie-chart": ({ option }) => (
    <PieChart option={option as any} renderer="svg" />
  ),
  "donut-chart": ({ option }) => (
    <PieChart option={option as any} renderer="svg" />
  ),
  "rose-chart": ({ option }) => (
    <PieChart option={option as any} renderer="svg" />
  ),
  "half-donut-chart": ({ option }) => (
    <PieChart option={option as any} renderer="svg" />
  ),

  // Scatter
  "scatter-chart": ({ option }) => (
    <ScatterChart option={option as any} renderer="svg" />
  ),
  "bubble-chart": ({ option }) => (
    <ScatterChart option={option as any} renderer="svg" />
  ),

  // Radar & Gauge
  "radar-chart": ({ option }) => (
    <RadarChart option={option as any} renderer="svg" />
  ),
  "filled-radar-chart": ({ option }) => (
    <RadarChart option={option as any} renderer="svg" />
  ),
  "gauge-chart": ({ option }) => (
    <GaugeChart option={option as any} renderer="svg" />
  ),
  "multi-gauge-chart": ({ option }) => (
    <GaugeChart option={option as any} renderer="svg" />
  ),

  // Statistical
  "boxplot-chart": ({ option }) => (
    <BoxplotChart option={option as any} renderer="svg" />
  ),
  "candlestick-chart": ({ option }) => (
    <CandlestickChart option={option as any} renderer="svg" />
  ),
  "heatmap-chart": ({ option }) => (
    <HeatmapChart option={option as any} renderer="svg" />
  ),
  "matrix-chart": ({ option }) => (
    <MatrixChart option={option as any} renderer="svg" />
  ),
  "calendar-chart": ({ option }) => (
    <CalendarChart option={option as any} renderer="svg" />
  ),

  // Hierarchical
  "tree-chart": ({ option }) => (
    <TreeChart option={option as any} renderer="svg" />
  ),
  "treemap-chart": ({ option }) => (
    <TreemapChart option={option as any} renderer="svg" />
  ),
  "sunburst-chart": ({ option }) => (
    <SunburstChart option={option as any} renderer="svg" />
  ),
  "graph-chart": ({ option }) => (
    <GraphChart option={option as any} renderer="svg" />
  ),

  // Flow
  "sankey-chart": ({ option }) => (
    <SankeyChart option={option as any} renderer="svg" />
  ),
  "funnel-chart": ({ option }) => (
    <FunnelChart option={option as any} renderer="svg" />
  ),
  "parallel-chart": ({ option }) => (
    <ParallelChart option={option as any} renderer="svg" />
  ),
  "theme-river-chart": ({ option }) => (
    <ThemeRiverChart option={option as any} renderer="svg" />
  ),

  // Custom
  "custom-chart": ({ option }) => (
    <CustomChart option={option as any} renderer="svg" />
  ),
};
