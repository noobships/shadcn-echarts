/**
 * Theme builder utilities
 * 
 * Converts shadcn/ui CSS variables (oklch format) to ECharts theme format
 */

import type { EChartsTheme, ShadcnChartColors, ThemeMode } from './types'

/**
 * Convert oklch color to hex
 * 
 * Uses browser CSS.supports() and getComputedStyle() when available for accurate conversion.
 * Falls back to manual conversion for SSR or when browser APIs aren't available.
 * 
 * @param oklch - oklch color string (e.g., "oklch(0.646 0.222 41.116)")
 * @returns hex color string
 */
export function oklchToHex(oklch: string): string {
  // If already a hex color, return as-is
  if (/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(oklch)) {
    return oklch
  }

  // If already rgb/rgba, convert to hex
  const rgbMatch = oklch.match(/rgba?\(([^)]+)\)/)
  if (rgbMatch) {
    const values = rgbMatch[1]?.split(',').map((v) => parseInt(v.trim(), 10)) ?? []
    if (values.length >= 3) {
      return rgbToHex(values[0] ?? 0, values[1] ?? 0, values[2] ?? 0)
    }
  }

  // Try browser-based conversion first (most accurate)
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      // Create a temporary element to use getComputedStyle
      const tempEl = document.createElement('div')
      tempEl.style.color = oklch
      document.body.appendChild(tempEl)
      const computed = getComputedStyle(tempEl).color
      document.body.removeChild(tempEl)

      // Parse rgb/rgba from computed style
      const computedRgb = computed.match(/\d+/g)
      if (computedRgb && computedRgb.length >= 3) {
        return rgbToHex(
          parseInt(computedRgb[0] ?? '0', 10),
          parseInt(computedRgb[1] ?? '0', 10),
          parseInt(computedRgb[2] ?? '0', 10)
        )
      }
    } catch {
      // Fall through to manual conversion
    }
  }

  // Manual conversion fallback
  const match = oklch.match(/oklch\(([^)]+)\)/)
  if (!match) {
    return oklch // Return as-is if not oklch format
  }

  const values = match[1]?.trim().split(/\s+/).map(parseFloat) ?? []
  if (values.length < 3) {
    return oklch
  }

  const [l, c, h] = values
  if (l === undefined || c === undefined || h === undefined) {
    return oklch
  }

  // Convert oklch to rgb
  const rgb = oklchToRgb(l, c, h)
  return rgbToHex(rgb[0], rgb[1], rgb[2])
}

/**
 * Convert oklch to rgb (simplified implementation)
 * 
 * NOTE: This is a basic conversion. For production use, consider:
 * - Using a proper color library like `culori` or `colorjs.io`
 * - Or using CSS.supports() and getComputedStyle() to let the browser handle conversion
 * 
 * For now, this provides a working implementation that handles most cases.
 */
function oklchToRgb(l: number, c: number, h: number): [number, number, number] {
  // Convert oklch to oklab first
  const a = c * Math.cos((h * Math.PI) / 180)
  const b = c * Math.sin((h * Math.PI) / 180)

  // Convert oklab to linear rgb
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = l - 0.0894841775 * a - 1.291485548 * b

  const l_c = l_ ** 3
  const m_c = m_ ** 3
  const s_c = s_ ** 3

  // Convert to rgb
  const r = +4.0767416621 * l_c - 3.3077115913 * m_c + 0.2309699292 * s_c
  const g = -1.2684380046 * l_c + 2.6097574011 * m_c - 0.3413193965 * s_c
  const bValue = -0.0041960863 * l_c - 0.7034186147 * m_c + 1.707614701 * s_c

  // Clamp and convert to 0-255 range
  return [
    Math.round(Math.max(0, Math.min(1, r)) * 255),
    Math.round(Math.max(0, Math.min(1, g)) * 255),
    Math.round(Math.max(0, Math.min(1, bValue)) * 255),
  ]
}

/**
 * Convert rgb to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`
}

/**
 * Get CSS variable value from DOM
 * 
 * @param varName - CSS variable name (e.g., "--chart-1")
 * @param element - Element to read from (defaults to document.documentElement)
 * @returns CSS variable value
 */
export function getCSSVariable(
  varName: string,
  element?: HTMLElement
): string {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return ''
  }
  const targetElement = element ?? document.documentElement
  return getComputedStyle(targetElement).getPropertyValue(varName).trim()
}

/**
 * Extract shadcn/ui chart colors from CSS variables
 * 
 * @param element - Element to read CSS variables from
 * @returns ShadcnChartColors object
 */
export function extractShadcnColors(
  element?: HTMLElement
): ShadcnChartColors {
  return {
    chart1: getCSSVariable('--chart-1', element),
    chart2: getCSSVariable('--chart-2', element),
    chart3: getCSSVariable('--chart-3', element),
    chart4: getCSSVariable('--chart-4', element),
    chart5: getCSSVariable('--chart-5', element),
    background: getCSSVariable('--background', element),
    foreground: getCSSVariable('--foreground', element),
    muted: getCSSVariable('--muted', element),
    mutedForeground: getCSSVariable('--muted-foreground', element),
    border: getCSSVariable('--border', element),
    primary: getCSSVariable('--primary', element),
    primaryForeground: getCSSVariable('--primary-foreground', element),
  }
}

/**
 * Build ECharts theme from shadcn/ui colors
 * 
 * Creates a comprehensive theme that covers all ECharts chart types and components.
 * 
 * @param colors - ShadcnChartColors object
 * @param mode - Theme mode ('light' or 'dark')
 * @returns ECharts theme object
 */
export function buildEChartsTheme(
  colors: ShadcnChartColors,
  mode: ThemeMode = 'light'
): EChartsTheme {
  // Convert oklch colors to hex
  const chartColors = [
    oklchToHex(colors.chart1),
    oklchToHex(colors.chart2),
    oklchToHex(colors.chart3),
    oklchToHex(colors.chart4),
    oklchToHex(colors.chart5),
  ]

  const backgroundColor = oklchToHex(colors.background)
  const textColor = oklchToHex(colors.foreground)
  const borderColor = oklchToHex(colors.border)
  const mutedTextColor = oklchToHex(colors.mutedForeground)
  const mutedColor = oklchToHex(colors.muted)
  const primaryColor = oklchToHex(colors.primary)

  // Tooltip background with better contrast
  const tooltipBg = mode === 'dark'
    ? 'rgba(0, 0, 0, 0.85)'
    : 'rgba(255, 255, 255, 0.95)'

  return {
    // Global color palette
    color: chartColors,
    backgroundColor,

    // Global text style
    textStyle: {
      color: textColor,
    },

    // Title component
    title: {
      textStyle: {
        color: textColor,
      },
      subtextStyle: {
        color: mutedTextColor,
      },
    },

    // Line chart series
    line: {
      itemStyle: {
        borderColor: borderColor,
      },
      lineStyle: {
        color: chartColors[0],
      },
      areaStyle: {
        color: chartColors[0],
      },
      label: {
        color: textColor,
      },
    },

    // Bar chart series
    bar: {
      itemStyle: {
        color: chartColors[0],
        borderColor: borderColor,
      },
      label: {
        color: textColor,
      },
    },

    // Pie chart series
    pie: {
      itemStyle: {
        borderColor: backgroundColor,
      },
      label: {
        color: textColor,
      },
    },

    // Scatter chart series
    scatter: {
      itemStyle: {
        borderColor: borderColor,
      },
      label: {
        color: textColor,
      },
    },

    // Radar chart series
    radar: {
      itemStyle: {
        borderColor: borderColor,
      },
      lineStyle: {
        color: chartColors[0],
      },
      areaStyle: {
        color: chartColors[0],
      },
      label: {
        color: textColor,
      },
    },

    // Boxplot chart series
    boxplot: {
      itemStyle: {
        borderColor: borderColor,
      },
      label: {
        color: textColor,
      },
    },

    // Parallel chart series
    parallel: {
      itemStyle: {
        borderColor: borderColor,
      },
      lineStyle: {
        color: chartColors[0],
      },
      areaStyle: {
        color: chartColors[0],
      },
      label: {
        color: textColor,
      },
    },

    // Sankey chart series
    sankey: {
      itemStyle: {
        borderColor: borderColor,
      },
      label: {
        color: textColor,
      },
    },

    // Funnel chart series
    funnel: {
      itemStyle: {
        borderColor: borderColor,
      },
      label: {
        color: textColor,
      },
    },

    // Gauge chart series
    gauge: {
      itemStyle: {
        color: primaryColor,
        borderColor: borderColor,
      },
      axisLine: {
        lineStyle: {
          color: borderColor,
        },
      },
      splitLine: {
        lineStyle: {
          color: borderColor,
        },
      },
      axisTick: {
        lineStyle: {
          color: borderColor,
        },
      },
      axisLabel: {
        color: mutedTextColor,
      },
      pointer: {
        itemStyle: {
          color: primaryColor,
        },
      },
      title: {
        color: textColor,
      },
      detail: {
        color: textColor,
      },
    },

    // Candlestick chart series
    candlestick: {
      itemStyle: {
        color: chartColors[0],
        color0: chartColors[1],
        borderColor: borderColor,
        borderColor0: borderColor,
      },
    },

    // Graph chart series
    graph: {
      itemStyle: {
        borderColor: borderColor,
      },
      lineStyle: {
        color: borderColor,
      },
      label: {
        color: textColor,
      },
    },

    // Map/Geo chart series
    map: {
      itemStyle: {
        areaColor: mutedColor,
        borderColor: borderColor,
      },
      label: {
        color: textColor,
      },
    },

    geo: {
      itemStyle: {
        areaColor: mutedColor,
        borderColor: borderColor,
      },
      label: {
        color: textColor,
      },
    },

    // Category axis
    categoryAxis: {
      axisLine: {
        lineStyle: {
          color: borderColor,
        },
      },
      axisTick: {
        lineStyle: {
          color: borderColor,
        },
      },
      axisLabel: {
        color: mutedTextColor,
      },
      splitLine: {
        lineStyle: {
          color: borderColor,
        },
      },
    },

    // Value axis
    valueAxis: {
      axisLine: {
        lineStyle: {
          color: borderColor,
        },
      },
      axisTick: {
        lineStyle: {
          color: borderColor,
        },
      },
      axisLabel: {
        color: mutedTextColor,
      },
      splitLine: {
        lineStyle: {
          color: borderColor,
        },
      },
    },

    // Log axis
    logAxis: {
      axisLine: {
        lineStyle: {
          color: borderColor,
        },
      },
      axisTick: {
        lineStyle: {
          color: borderColor,
        },
      },
      axisLabel: {
        color: mutedTextColor,
      },
      splitLine: {
        lineStyle: {
          color: borderColor,
        },
      },
    },

    // Time axis
    timeAxis: {
      axisLine: {
        lineStyle: {
          color: borderColor,
        },
      },
      axisTick: {
        lineStyle: {
          color: borderColor,
        },
      },
      axisLabel: {
        color: mutedTextColor,
      },
      splitLine: {
        lineStyle: {
          color: borderColor,
        },
      },
    },

    // Toolbox component
    toolbox: {
      iconStyle: {
        borderColor: borderColor,
      },
      emphasis: {
        iconStyle: {
          borderColor: primaryColor,
        },
      },
    },

    // Legend component
    legend: {
      textStyle: {
        color: textColor,
      },
    },

    // Tooltip component
    tooltip: {
      backgroundColor: tooltipBg,
      borderColor: borderColor,
      textStyle: {
        color: textColor,
      },
    },

    // Timeline component
    timeline: {
      lineStyle: {
        color: borderColor,
      },
      itemStyle: {
        color: mutedColor,
        borderColor: borderColor,
      },
      controlStyle: {
        color: textColor,
        borderColor: borderColor,
      },
      label: {
        color: textColor,
      },
    },

    // VisualMap component
    visualMap: {
      textStyle: {
        color: textColor,
      },
    },

    // DataZoom component
    dataZoom: {
      textStyle: {
        color: mutedTextColor,
      },
      handleStyle: {
        color: primaryColor,
        borderColor: borderColor,
      },
      dataBackground: {
        lineStyle: {
          color: borderColor,
        },
        areaStyle: {
          color: mutedColor,
        },
      },
      selectedDataBackground: {
        lineStyle: {
          color: primaryColor,
        },
        areaStyle: {
          color: chartColors[0],
        },
      },
      fillerColor: mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.05)',
      borderColor: borderColor,
    },

    // MarkPoint component
    markPoint: {
      label: {
        color: textColor,
      },
    },

    // MarkLine component
    markLine: {
      label: {
        color: textColor,
      },
      lineStyle: {
        color: borderColor,
      },
    },

    // MarkArea component
    markArea: {
      label: {
        color: textColor,
      },
    },
  }
}
