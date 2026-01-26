/**
 * Core TypeScript types for @shadcn/echarts
 * 
 * Leverages ECharts' ComposeOption pattern for strict type safety.
 */

import type { ComposeOption } from 'echarts/core'
import type {
  // Series option types
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  ScatterSeriesOption,
  RadarSeriesOption,
  MapSeriesOption,
  TreeSeriesOption,
  TreemapSeriesOption,
  GraphSeriesOption,
  GaugeSeriesOption,
  FunnelSeriesOption,
  ParallelSeriesOption,
  SankeySeriesOption,
  BoxplotSeriesOption,
  CandlestickSeriesOption,
  HeatmapSeriesOption,
  LinesSeriesOption,
  PictorialBarSeriesOption,
  ThemeRiverSeriesOption,
  SunburstSeriesOption,
  CustomSeriesOption,
  ChordSeriesOption,
} from 'echarts/charts'
import type {
  // Component option types
  TitleComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
  GridComponentOption,
  RadarComponentOption,
  GeoComponentOption,
  ParallelComponentOption,
  CalendarComponentOption,
  DatasetComponentOption,
} from 'echarts/components'

/**
 * Common component options used across all charts
 */
type CommonComponentOptions =
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | GridComponentOption
  | DatasetComponentOption

/**
 * Chart type specific option types
 * These will be used for individual chart components
 */
export type BarChartOption = ComposeOption<
  | BarSeriesOption
  | CommonComponentOptions
>

export type LineChartOption = ComposeOption<
  | LineSeriesOption
  | CommonComponentOptions
>

export type PieChartOption = ComposeOption<
  | PieSeriesOption
  | CommonComponentOptions
>

export type ScatterChartOption = ComposeOption<
  | ScatterSeriesOption
  | CommonComponentOptions
>

export type AreaChartOption = ComposeOption<
  | LineSeriesOption
  | CommonComponentOptions
>

export type RadarChartOption = ComposeOption<
  | RadarSeriesOption
  | RadarComponentOption
  | CommonComponentOptions
>

export type MapChartOption = ComposeOption<
  | MapSeriesOption
  | GeoComponentOption
  | CommonComponentOptions
>

export type TreeChartOption = ComposeOption<
  | TreeSeriesOption
  | CommonComponentOptions
>

export type TreemapChartOption = ComposeOption<
  | TreemapSeriesOption
  | CommonComponentOptions
>

export type GraphChartOption = ComposeOption<
  | GraphSeriesOption
  | CommonComponentOptions
>

export type GaugeChartOption = ComposeOption<
  | GaugeSeriesOption
  | CommonComponentOptions
>

export type FunnelChartOption = ComposeOption<
  | FunnelSeriesOption
  | CommonComponentOptions
>

export type ParallelChartOption = ComposeOption<
  | ParallelSeriesOption
  | ParallelComponentOption
  | CommonComponentOptions
>

export type SankeyChartOption = ComposeOption<
  | SankeySeriesOption
  | CommonComponentOptions
>

export type BoxplotChartOption = ComposeOption<
  | BoxplotSeriesOption
  | CommonComponentOptions
>

export type CandlestickChartOption = ComposeOption<
  | CandlestickSeriesOption
  | CommonComponentOptions
>

export type HeatmapChartOption = ComposeOption<
  | HeatmapSeriesOption
  | CommonComponentOptions
>

export type LinesChartOption = ComposeOption<
  | LinesSeriesOption
  | CommonComponentOptions
>

export type PictorialBarChartOption = ComposeOption<
  | PictorialBarSeriesOption
  | CommonComponentOptions
>

export type ThemeRiverChartOption = ComposeOption<
  | ThemeRiverSeriesOption
  | CommonComponentOptions
>

export type SunburstChartOption = ComposeOption<
  | SunburstSeriesOption
  | CommonComponentOptions
>

export type CustomChartOption = ComposeOption<
  | CustomSeriesOption
  | CommonComponentOptions
>

export type CalendarChartOption = ComposeOption<
  | CalendarComponentOption
  | CommonComponentOptions
>

export type ChordChartOption = ComposeOption<
  | ChordSeriesOption
  | CommonComponentOptions
>

/**
 * Chart component props base interface
 */
export interface BaseChartProps {
  /** Chart width */
  width?: number | string
  /** Chart height */
  height?: number | string
  /** Theme name ('light', 'dark', or custom) */
  theme?: string
  /** Whether to enable SSR mode */
  ssr?: boolean
  /** Renderer type ('canvas' or 'svg') */
  renderer?: 'canvas' | 'svg'
  /** Loading state */
  loading?: boolean
  /** Loading options */
  loadingOption?: object
  /** Chart option (for advanced usage) */
  option?: object
  /** Event handlers */
  onEvents?: Record<string, (params: unknown) => void>
  /** Chart style */
  style?: Record<string, string | number> | { [key: string]: string | number }
  /** Chart className */
  className?: string
  /** Auto-resize */
  autoResize?: boolean
}

/**
 * SSR rendering options
 */
export interface SSRRenderOptions {
  /** Chart width (required for SSR) */
  width: number
  /** Chart height (required for SSR) */
  height: number
  /** Renderer type */
  renderer?: 'svg' | 'canvas'
  /** Whether to include animations */
  animation?: boolean
}
