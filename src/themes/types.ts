/**
 * Theme type definitions
 */

/**
 * shadcn/ui CSS variable names for chart colors
 */
export interface ShadcnChartColors {
  chart1: string
  chart2: string
  chart3: string
  chart4: string
  chart5: string
  background: string
  foreground: string
  card?: string
  cardForeground?: string
  popover?: string
  popoverForeground?: string
  secondary?: string
  secondaryForeground?: string
  muted: string
  mutedForeground: string
  accent?: string
  accentForeground?: string
  destructive?: string
  destructiveForeground?: string
  border: string
  input?: string
  ring?: string
  primary: string
  primaryForeground: string
}

/**
 * ECharts theme object structure
 */
export interface EChartsTheme {
  color?: string[]
  backgroundColor?: string
  textStyle?: {
    color?: string
    fontFamily?: string
    fontSize?: number
    fontWeight?: string | number
  }
  title?: {
    textStyle?: {
      color?: string
      fontFamily?: string
      fontSize?: number
      fontWeight?: string | number
    }
    subtextStyle?: {
      color?: string
      fontFamily?: string
      fontSize?: number
      fontWeight?: string | number
    }
  }
  line?: {
    itemStyle?: {
      borderColor?: string
    }
    lineStyle?: {
      color?: string
    }
    areaStyle?: {
      color?: string
    }
    label?: {
      color?: string
    }
  }
  radar?: {
    itemStyle?: {
      borderColor?: string
    }
    lineStyle?: {
      color?: string
    }
    areaStyle?: {
      color?: string
    }
    label?: {
      color?: string
    }
  }
  bar?: {
    itemStyle?: {
      color?: string
      borderColor?: string
    }
    label?: {
      color?: string
    }
  }
  pie?: {
    itemStyle?: {
      borderColor?: string
    }
    label?: {
      color?: string
    }
  }
  scatter?: {
    itemStyle?: {
      borderColor?: string
    }
    label?: {
      color?: string
    }
  }
  boxplot?: {
    itemStyle?: {
      borderColor?: string
    }
    label?: {
      color?: string
    }
  }
  parallel?: {
    itemStyle?: {
      borderColor?: string
    }
    lineStyle?: {
      color?: string
    }
    areaStyle?: {
      color?: string
    }
    label?: {
      color?: string
    }
  }
  sankey?: {
    itemStyle?: {
      borderColor?: string
    }
    label?: {
      color?: string
    }
  }
  funnel?: {
    itemStyle?: {
      borderColor?: string
    }
    label?: {
      color?: string
    }
  }
  gauge?: {
    itemStyle?: {
      color?: string
      borderColor?: string
    }
    axisLine?: {
      lineStyle?: {
        color?: string
      }
    }
    splitLine?: {
      lineStyle?: {
        color?: string
      }
    }
    axisTick?: {
      show?: boolean
      lineStyle?: {
        color?: string
      }
    }
    axisLabel?: {
      color?: string
    }
    pointer?: {
      itemStyle?: {
        color?: string
      }
    }
    title?: {
      color?: string
    }
    detail?: {
      color?: string
    }
  }
  candlestick?: {
    itemStyle?: {
      color?: string
      color0?: string
      borderColor?: string
      borderColor0?: string
    }
  }
  graph?: {
    itemStyle?: {
      borderColor?: string
    }
    lineStyle?: {
      color?: string
    }
    label?: {
      color?: string
    }
  }
  map?: {
    itemStyle?: {
      areaColor?: string
      borderColor?: string
    }
    label?: {
      color?: string
    }
  }
  geo?: {
    itemStyle?: {
      areaColor?: string
      borderColor?: string
    }
    label?: {
      color?: string
    }
  }
  categoryAxis?: {
    axisLine?: {
      show?: boolean
      lineStyle?: {
        color?: string
      }
    }
    axisTick?: {
      show?: boolean
      lineStyle?: {
        color?: string
      }
    }
    axisLabel?: {
      color?: string
    }
    splitLine?: {
      show?: boolean
      lineStyle?: {
        color?: string
      }
    }
  }
  valueAxis?: {
    axisLine?: {
      show?: boolean
      lineStyle?: {
        color?: string
      }
    }
    axisTick?: {
      show?: boolean
      lineStyle?: {
        color?: string
      }
    }
    axisLabel?: {
      color?: string
    }
    splitLine?: {
      show?: boolean
      lineStyle?: {
        color?: string
        type?: string
      }
    }
  }
  logAxis?: {
    axisLine?: {
      show?: boolean
      lineStyle?: {
        color?: string
      }
    }
    axisTick?: {
      show?: boolean
      lineStyle?: {
        color?: string
      }
    }
    axisLabel?: {
      color?: string
    }
    splitLine?: {
      show?: boolean
      lineStyle?: {
        color?: string
      }
    }
  }
  timeAxis?: {
    axisLine?: {
      show?: boolean
      lineStyle?: {
        color?: string
      }
    }
    axisTick?: {
      show?: boolean
      lineStyle?: {
        color?: string
      }
    }
    axisLabel?: {
      color?: string
    }
    splitLine?: {
      show?: boolean
      lineStyle?: {
        color?: string
      }
    }
  }
  toolbox?: {
    iconStyle?: {
      borderColor?: string
    }
    emphasis?: {
      iconStyle?: {
        borderColor?: string
      }
    }
  }
  legend?: {
    textStyle?: {
      color?: string
    }
  }
  tooltip?: {
    backgroundColor?: string
    borderColor?: string
    textStyle?: {
      color?: string
    }
  }
  timeline?: {
    lineStyle?: {
      color?: string
    }
    itemStyle?: {
      color?: string
      borderColor?: string
    }
    controlStyle?: {
      color?: string
      borderColor?: string
    }
    label?: {
      color?: string
    }
  }
  visualMap?: {
    textStyle?: {
      color?: string
    }
  }
  dataZoom?: {
    textStyle?: {
      color?: string
    }
    handleStyle?: {
      color?: string
      borderColor?: string
    }
    dataBackground?: {
      lineStyle?: {
        color?: string
      }
      areaStyle?: {
        color?: string
      }
    }
    selectedDataBackground?: {
      lineStyle?: {
        color?: string
      }
      areaStyle?: {
        color?: string
      }
    }
    fillerColor?: string
    borderColor?: string
  }
  markPoint?: {
    label?: {
      color?: string
    }
  }
  markLine?: {
    label?: {
      color?: string
    }
    lineStyle?: {
      color?: string
    }
  }
  markArea?: {
    label?: {
      color?: string
    }
  }
}

/**
 * Theme mode
 */
export type ThemeMode = 'light' | 'dark'
