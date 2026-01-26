/**
 * SSR (Server-Side Rendering) utilities
 * 
 * Provides server-side rendering support for ECharts charts
 */

import * as echarts from 'echarts/core'
import type { EChartsCoreOption } from 'echarts/core'
import type { SSRRenderOptions } from './types'

/**
 * Render chart to SVG string (SSR)
 * 
 * @param option - ECharts option
 * @param opts - SSR render options
 * @returns SVG string
 */
export function renderToSVGString(
  option: EChartsCoreOption,
  opts: SSRRenderOptions
): string {
  const chart = echarts.init(null, null, {
    renderer: opts.renderer || 'svg',
    ssr: true,
    width: opts.width,
    height: opts.height,
  })

  try {
    chart.setOption(option, { notMerge: true })
    const svgStr = chart.renderToSVGString()
    return svgStr
  } finally {
    chart.dispose()
  }
}

/**
 * Render chart to SVG string with theme (SSR)
 * 
 * @param option - ECharts option
 * @param opts - SSR render options
 * @param theme - Theme name or theme object
 * @returns SVG string
 */
export function renderToSVGStringWithTheme(
  option: EChartsCoreOption,
  opts: SSRRenderOptions,
  theme?: string | object
): string {
  const chart = echarts.init(null, theme || null, {
    renderer: opts.renderer || 'svg',
    ssr: true,
    width: opts.width,
    height: opts.height,
  })

  try {
    const finalOption = opts.animation === false
      ? { ...option, animation: false }
      : option
    chart.setOption(finalOption, { notMerge: true })
    const svgStr = chart.renderToSVGString()
    return svgStr
  } finally {
    chart.dispose()
  }
}

/**
 * Check if running in SSR environment
 * 
 * @returns true if SSR environment
 */
export function isSSR(): boolean {
  return typeof window === 'undefined'
}
