/**
 * Core ECharts wrapper utilities
 * 
 * Provides tree-shakeable ECharts initialization and management
 */

import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {
  AriaComponent,
  AxisPointerComponent,
  BrushComponent,
  CalendarComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  DatasetComponent,
  GeoComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  MatrixComponent,
  ParallelComponent,
  PolarComponent,
  RadarComponent,
  SingleAxisComponent,
  TimelineComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
  VisualMapComponent,
} from 'echarts/components'
import type { EChartsCoreOption, EChartsType } from 'echarts/core'

// Ensure renderer and shared components are always registered.
let baseRegistered = false
if (!baseRegistered) {
  echarts.use([
    CanvasRenderer,
    AriaComponent,
    AxisPointerComponent,
    BrushComponent,
    CalendarComponent,
    DataZoomComponent,
    DataZoomInsideComponent,
    DataZoomSliderComponent,
    DatasetComponent,
    GeoComponent,
    GraphicComponent,
    GridComponent,
    LegendComponent,
    MarkAreaComponent,
    MarkLineComponent,
    MarkPointComponent,
    MatrixComponent,
    ParallelComponent,
    PolarComponent,
    RadarComponent,
    SingleAxisComponent,
    TimelineComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    TransformComponent,
    VisualMapComponent,
  ])
  baseRegistered = true
}

/**
 * ECharts initialization options
 */
export interface InitOptions {
  /** Container element or selector */
  container?: HTMLElement | string | null
  /** Theme name */
  theme?: string | object
  /** Renderer type */
  renderer?: 'canvas' | 'svg'
  /** SSR mode */
  ssr?: boolean
  /** Chart width (required for SSR) */
  width?: number
  /** Chart height (required for SSR) */
  height?: number
  /** Device pixel ratio */
  devicePixelRatio?: number
  /** Locale */
  locale?: string
}

/**
 * Initialize an ECharts instance
 * 
 * @param container - Container element, selector, or null for SSR
 * @param theme - Theme name or theme object
 * @param opts - Additional initialization options
 * @returns ECharts instance
 */
export function initChart(
  container: HTMLElement | string | null = null,
  theme?: string | object,
  opts?: InitOptions
): EChartsType {
  const options = {
    renderer: opts?.renderer || 'canvas',
    ssr: opts?.ssr || false,
    width: opts?.width,
    height: opts?.height,
    devicePixelRatio: opts?.devicePixelRatio,
    locale: opts?.locale,
  }

  // echarts.init accepts HTMLElement | null | undefined, but also accepts string selector
  // We need to handle string case separately or cast it
  const containerElement = typeof container === 'string' 
    ? (typeof document !== 'undefined' ? document.querySelector(container) as HTMLElement : null)
    : container
  
  return echarts.init(containerElement ?? undefined, theme ?? undefined, options)
}

/**
 * Dispose an ECharts instance
 * 
 * @param chart - ECharts instance to dispose
 */
export function disposeChart(chart: EChartsType | null): void {
  if (chart) {
    chart.dispose()
  }
}

/**
 * Resize an ECharts instance
 * 
 * @param chart - ECharts instance to resize
 * @param opts - Resize options (width, height)
 */
export function resizeChart(
  chart: EChartsType | null,
  opts?: { width?: number; height?: number }
): void {
  if (chart) {
    chart.resize(opts)
  }
}

/**
 * Set option on an ECharts instance
 * 
 * @param chart - ECharts instance
 * @param option - Chart option
 * @param opts - SetOption options (notMerge, lazyUpdate)
 */
export function setChartOption(
  chart: EChartsType | null,
  option: EChartsCoreOption,
  opts?: { notMerge?: boolean; lazyUpdate?: boolean }
): void {
  if (chart) {
    chart.setOption(option, opts)
  }
}

/**
 * Get option from an ECharts instance
 * 
 * @param chart - ECharts instance
 * @returns Current chart option
 */
export function getChartOption(chart: EChartsType | null): EChartsCoreOption | null {
  if (!chart) {
    return null
  }
  return chart.getOption()
}
