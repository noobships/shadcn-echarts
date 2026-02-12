/**
 * Base Chart component
 * 
 * Core React wrapper for ECharts with lifecycle management,
 * responsive resizing, and theme integration
 */

'use client'

import { useEffect, useMemo, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import { initChart, disposeChart, resizeChart, setChartOption } from '../core/chart'
import type { EChartsType, EChartsCoreOption } from 'echarts/core'
import type { BaseChartProps } from '../core/types'
import type { ThemeMode } from '../themes/types'
import { getThemeMode, registerShadcnTheme } from '../themes/registry'
import { applyMinimalPreset } from '../presets/minimal'

function shadcnThemeName(mode: ThemeMode): string {
  return mode === 'dark' ? 'shadcn-dark' : 'shadcn-light'
}

function normalizeTheme(
  themeProp: string | undefined,
  autoMode: ThemeMode
): { themeName: string; mode: ThemeMode | null; isShadcn: boolean } {
  if (themeProp === undefined) {
    return { themeName: shadcnThemeName(autoMode), mode: autoMode, isShadcn: true }
  }

  const t = themeProp.trim()
  if (t === 'dark' || t === 'light') {
    return { themeName: shadcnThemeName(t), mode: t, isShadcn: true }
  }

  if (t === 'shadcn-dark') {
    return { themeName: t, mode: 'dark', isShadcn: true }
  }

  if (t === 'shadcn-light') {
    return { themeName: t, mode: 'light', isShadcn: true }
  }

  return { themeName: t, mode: null, isShadcn: false }
}

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
    preset = true,
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
  const lastOptionRef = useRef<EChartsCoreOption | null>(null)

  const [autoMode, setAutoMode] = useState<ThemeMode>(() => getThemeMode())
  const resolvedTheme = useMemo(() => normalizeTheme(theme, autoMode), [theme, autoMode])

  // Watch for mode changes only when theme isn't explicitly provided
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    if (theme !== undefined) {
      return
    }

    const update = () => {
      setAutoMode(getThemeMode())
    }

    // Sync once on mount (covers cases where theme class is applied late)
    update()

    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleMediaChange = () => update()

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange)
    } else {
      mediaQuery.addListener(handleMediaChange)
    }

    return () => {
      observer.disconnect()
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange)
      } else {
        mediaQuery.removeListener(handleMediaChange)
      }
    }
  }, [theme])

  // Initialize chart (do not re-init on theme changes; use setTheme instead)
  useEffect(() => {
    if (ssr || typeof window === 'undefined') {
      return
    }

    const container = containerRef.current
    if (!container) {
      return
    }

    // Ensure shadcn themes are registered before init when using them
    if (resolvedTheme.isShadcn && resolvedTheme.mode) {
      registerShadcnTheme(resolvedTheme.mode)
    }

    // Initialize chart
    chartRef.current = initChart(container, resolvedTheme.themeName, {
      renderer,
      ssr: false,
      width: typeof width === 'number' ? width : undefined,
      height: typeof height === 'number' ? height : undefined,
    })

    // Cleanup function
    return () => {
      if (chartRef.current) {
        disposeChart(chartRef.current)
        chartRef.current = null
      }
    }
  }, [ssr, renderer]) // Only re-initialize if these change

  // Update option when it changes
  useEffect(() => {
    if (chartRef.current && option) {
      const effectiveOption = preset ? applyMinimalPreset(option, { mode: resolvedTheme.mode ?? autoMode }) : option
      lastOptionRef.current = effectiveOption
      setChartOption(chartRef.current, effectiveOption, { notMerge, lazyUpdate })
    }
  }, [option, preset, notMerge, lazyUpdate, autoMode, resolvedTheme.mode])

  // Attach event handlers (and keep them updated)
  useEffect(() => {
    const chart = chartRef.current
    if (!chart || chart.isDisposed()) {
      return
    }

    if (!onEvents) {
      return
    }

    Object.entries(onEvents).forEach(([eventName, handler]) => {
      chart.on(eventName, handler)
    })

    return () => {
      Object.keys(onEvents).forEach((eventName) => {
        chart.off(eventName)
      })
    }
  }, [onEvents])

  // Update theme (auto or explicit) and re-apply option to pick up theme defaults
  useEffect(() => {
    const chart = chartRef.current
    if (!chart || chart.isDisposed()) {
      return
    }

    if (resolvedTheme.isShadcn && resolvedTheme.mode) {
      registerShadcnTheme(resolvedTheme.mode)
    }

    if (typeof (chart as any).setTheme === 'function') {
      ;(chart as any).setTheme(resolvedTheme.themeName)
    }

    const currentOption = lastOptionRef.current
    if (currentOption) {
      setChartOption(chart, currentOption, { notMerge: true, lazyUpdate: true })
    }
  }, [resolvedTheme.themeName, resolvedTheme.isShadcn, resolvedTheme.mode])

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
