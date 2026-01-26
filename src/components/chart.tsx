/**
 * Base Chart component
 * 
 * Core React wrapper for ECharts with lifecycle management,
 * responsive resizing, and theme integration
 */

'use client'

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import { initChart, disposeChart, resizeChart, setChartOption } from '../core/chart'
import type { EChartsType, EChartsCoreOption } from 'echarts/core'
import type { BaseChartProps } from '../core/types'
import { getThemeName } from '../themes/registry'

export interface ChartRef {
  getEchartsInstance: () => EChartsType | null
  resize: (opts?: { width?: number; height?: number }) => void
}

/**
 * Base Chart component props
 */
export interface ChartProps extends BaseChartProps {
  /** ECharts option */
  option: EChartsCoreOption
  /** Whether to not merge option (default: false) */
  notMerge?: boolean
  /** Whether to lazy update (default: false) */
  lazyUpdate?: boolean
}

/**
 * Base Chart component
 * 
 * Handles ECharts instance lifecycle, responsive resizing, and theme integration.
 * 
 * @example
 * ```tsx
 * <Chart
 *   option={{
 *     xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
 *     yAxis: { type: 'value' },
 *     series: [{ type: 'line', data: [150, 230, 224] }]
 *   }}
 *   style={{ width: '100%', height: '400px' }}
 * />
 * ```
 */
export const Chart: ForwardRefExoticComponent<ChartProps & RefAttributes<ChartRef>> = forwardRef<ChartRef, ChartProps>(function Chart(
  {
    option,
    width,
    height,
    theme,
    ssr = false,
    renderer = 'canvas',
    loading = false,
    loadingOption,
    onEvents,
    style,
    className,
    autoResize = true,
    notMerge = false,
    lazyUpdate = false,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<EChartsType | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  // Initialize chart
  useEffect(() => {
    if (ssr || typeof window === 'undefined') {
      return
    }

    const container = containerRef.current
    if (!container) {
      return
    }

    // Determine theme
    const finalTheme = theme ?? getThemeName()

    // Initialize chart
    chartRef.current = initChart(container, finalTheme, {
      renderer,
      ssr: false,
      width: typeof width === 'number' ? width : undefined,
      height: typeof height === 'number' ? height : undefined,
    })

    // Set initial option
    if (option) {
      setChartOption(chartRef.current, option, { notMerge, lazyUpdate })
    }

    // Attach event handlers
    if (onEvents && chartRef.current) {
      Object.entries(onEvents).forEach(([eventName, handler]) => {
        chartRef.current?.on(eventName, handler)
      })
    }

    // Cleanup function
    return () => {
      if (chartRef.current) {
        // Remove event handlers
        if (onEvents) {
          Object.keys(onEvents).forEach((eventName) => {
            chartRef.current?.off(eventName)
          })
        }
        disposeChart(chartRef.current)
        chartRef.current = null
      }
    }
  }, [ssr, renderer, theme]) // Only re-initialize if these change

  // Update option when it changes
  useEffect(() => {
    if (chartRef.current && option) {
      setChartOption(chartRef.current, option, { notMerge, lazyUpdate })
    }
  }, [option, notMerge, lazyUpdate])

  // Update theme when it changes
  useEffect(() => {
    if (chartRef.current && theme !== undefined) {
      const finalTheme = theme ?? getThemeName()
      chartRef.current.setTheme(finalTheme)
    }
  }, [theme])

  // Handle loading state
  useEffect(() => {
    if (!chartRef.current) {
      return
    }

    if (loading) {
      chartRef.current.showLoading(loadingOption)
    } else {
      chartRef.current.hideLoading()
    }
  }, [loading, loadingOption])

  // Handle responsive resizing
  useEffect(() => {
    if (!autoResize || ssr || typeof window === 'undefined') {
      return
    }

    const chart = chartRef.current
    if (!chart) {
      return
    }

    const container = containerRef.current
    if (!container) {
      return
    }

    // Use ResizeObserver for better container size tracking
    const resizeObserver = new ResizeObserver(() => {
      if (chart && !chart.isDisposed()) {
        resizeChart(chart, {
          width: typeof width === 'number' ? width : undefined,
          height: typeof height === 'number' ? height : undefined,
        })
      }
    })

    resizeObserver.observe(container)
    resizeObserverRef.current = resizeObserver

    // Also listen to window resize as fallback
    const handleResize = () => {
      if (chart && !chart.isDisposed()) {
        resizeChart(chart, {
          width: typeof width === 'number' ? width : undefined,
          height: typeof height === 'number' ? height : undefined,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', handleResize)
      resizeObserverRef.current = null
    }
  }, [autoResize, ssr, width, height])

  // Expose chart instance via ref
  useImperativeHandle(
    ref,
    () => ({
      getEchartsInstance: () => chartRef.current,
      resize: (opts?: { width?: number; height?: number }) => {
        resizeChart(chartRef.current, opts)
      },
    }),
    []
  )

  // Calculate container styles
  const containerStyle: React.CSSProperties = {
    width: width ?? '100%',
    height: height ?? '400px',
    ...(style as React.CSSProperties),
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={containerStyle}
    />
  )
})

Chart.displayName = 'Chart'
