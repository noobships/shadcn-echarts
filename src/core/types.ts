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
 * 3D/WebGL Chart Option Types
 * 
 * Note: 3D and WebGL charts may require additional setup (e.g., echarts-gl).
 * These types use EChartsCoreOption as a base for flexibility.
 */
import type { EChartsCoreOption } from 'echarts/core'

export type Globe3DChartOption = EChartsCoreOption
export type Bar3DChartOption = EChartsCoreOption
export type Scatter3DChartOption = EChartsCoreOption
export type Surface3DChartOption = EChartsCoreOption
export type Map3DChartOption = EChartsCoreOption
export type Lines3DChartOption = EChartsCoreOption
export type Line3DChartOption = EChartsCoreOption
export type ScatterGLChartOption = EChartsCoreOption
export type LinesGLChartOption = EChartsCoreOption
export type GraphGLChartOption = EChartsCoreOption

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
