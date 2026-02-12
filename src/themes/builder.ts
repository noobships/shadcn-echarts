/**
 * Theme builder utilities
 * 
 * Converts shadcn/ui CSS variables (oklch format) to ECharts theme format
 */

import { formatHex, parse } from 'culori'
import type { EChartsTheme, ShadcnChartColors, ThemeMode } from './types'
import { resolveColor } from './resolveColor'

/**
 * Convert a CSS color string to a 6-digit hex color.
 *
 * Note: alpha is intentionally dropped. Use `resolveColor()` for RGBA-preserving output.
 */
export function oklchToHex(value: string): string {
  const input = value?.trim?.() ? value.trim() : ''
  if (!input) {
    return '#000000'
  }

  // If already a hex color, return as-is
  if (/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(input)) {
    return input
  }

  try {
    const parsed = parse(input)
    return parsed ? formatHex(parsed) : '#000000'
  } catch {
    return '#000000'
  }
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
  const colors = {
    chart1: getCSSVariable('--chart-1', element),
    chart2: getCSSVariable('--chart-2', element),
    chart3: getCSSVariable('--chart-3', element),
    chart4: getCSSVariable('--chart-4', element),
    chart5: getCSSVariable('--chart-5', element),
    background: getCSSVariable('--background', element),
    foreground: getCSSVariable('--foreground', element),
    card: getCSSVariable('--card', element),
    cardForeground: getCSSVariable('--card-foreground', element),
    popover: getCSSVariable('--popover', element),
    popoverForeground: getCSSVariable('--popover-foreground', element),
    secondary: getCSSVariable('--secondary', element),
    secondaryForeground: getCSSVariable('--secondary-foreground', element),
    muted: getCSSVariable('--muted', element),
    mutedForeground: getCSSVariable('--muted-foreground', element),
    accent: getCSSVariable('--accent', element),
    accentForeground: getCSSVariable('--accent-foreground', element),
    destructive: getCSSVariable('--destructive', element),
    destructiveForeground: getCSSVariable('--destructive-foreground', element),
    border: getCSSVariable('--border', element),
    input: getCSSVariable('--input', element),
    ring: getCSSVariable('--ring', element),
    primary: getCSSVariable('--primary', element),
    primaryForeground: getCSSVariable('--primary-foreground', element),
  }

  // Debug: Log if critical colors are missing
  if (typeof window !== 'undefined' && (!colors.chart1 || !colors.background || !colors.foreground)) {
    console.warn('[shadcn/echarts] Missing CSS variables:', {
      chart1: colors.chart1 || 'MISSING',
      background: colors.background || 'MISSING',
      foreground: colors.foreground || 'MISSING',
    })
  }

  return colors
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
  const fallbackPalette = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

  // Palette colors should usually be opaque; tokens like `--border` must preserve alpha.
  const chartColors = [
    resolveColor(colors.chart1, { fallback: fallbackPalette[0] }),
    resolveColor(colors.chart2, { fallback: fallbackPalette[1] }),
    resolveColor(colors.chart3, { fallback: fallbackPalette[2] }),
    resolveColor(colors.chart4, { fallback: fallbackPalette[3] }),
    resolveColor(colors.chart5, { fallback: fallbackPalette[4] }),
  ]

  const backgroundColor = resolveColor(colors.background, {
    fallback: mode === 'dark' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)',
  })
  const cardColor = resolveColor(colors.card ?? '', { fallback: backgroundColor })
  const popoverColor = resolveColor(colors.popover ?? '', { fallback: cardColor })

  const textColor = resolveColor(colors.foreground, {
    fallback: mode === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
  })
  const mutedTextColor = resolveColor(colors.mutedForeground, { fallback: textColor })

  // Preserve alpha (critical in dark mode for subtle separators)
  const borderColor = resolveColor(colors.border, {
    fallback: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
  })

  const inputColor = resolveColor(colors.input ?? '', { fallback: borderColor })
  const mutedColor = resolveColor(colors.muted, { fallback: borderColor })
  const primaryColor = resolveColor(colors.primary, { fallback: chartColors[0] ?? fallbackPalette[0] })
  const popoverTextColor = resolveColor(colors.popoverForeground ?? '', { fallback: textColor })

  const fontFamily =
    typeof window !== 'undefined' && typeof document !== 'undefined' && document.body
      ? getComputedStyle(document.body).fontFamily
      : undefined

  return {
    // Global color palette - use chartColors (which may have been replaced with fallbacks)
    color: chartColors,
    backgroundColor: 'transparent', // Use transparent so it inherits from parent

    // Global text style
    textStyle: {
      color: textColor,
      fontFamily,
      fontSize: 12,
    },

    // Title component
    title: {
      textStyle: {
        color: textColor,
        fontFamily,
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
      label: {
        color: textColor,
      },
    },

    // Bar chart series
    bar: {
      itemStyle: {
        borderColor: borderColor,
      },
      label: {
        color: textColor,
      },
    },

    // Pie chart series
    pie: {
      itemStyle: {
        borderColor: cardColor,
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
        show: false,
        lineStyle: {
          color: borderColor,
        },
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: borderColor,
        },
      },
      axisLabel: {
        color: mutedTextColor,
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: borderColor,
        },
      },
    },

    // Value axis
    valueAxis: {
      axisLine: {
        show: false,
        lineStyle: {
          color: borderColor,
        },
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: borderColor,
        },
      },
      axisLabel: {
        color: mutedTextColor,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: borderColor,
          type: 'solid',
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
        color: mutedTextColor,
      },
    },

    // Tooltip component
    tooltip: {
      backgroundColor: popoverColor,
      borderColor: borderColor,
      textStyle: {
        color: popoverTextColor,
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
      fillerColor: inputColor,
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
