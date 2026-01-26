/**
 * Bar Chart component
 * 
 * Tree-shakeable bar chart component with proper ECharts registration
 */

'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { BarChartOption } from '../../../core/types'

// Register required components
let registered = false

function registerComponents() {
  if (registered) {
    return
  }
  echarts.use([
    BarChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
  ])
  registered = true
}

export interface BarChartProps extends Omit<ChartProps, 'option'> {
  /** Bar chart option */
  option: BarChartOption
}

/**
 * Bar Chart component
 * 
 * @example
 * ```tsx
 * <BarChart
 *   option={{
 *     xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
 *     yAxis: { type: 'value' },
 *     series: [{ type: 'bar', data: [150, 230, 224] }]
 *   }}
 * />
 * ```
 */
export function BarChartComponent(props: BarChartProps): React.JSX.Element {
  const hasRegistered = useRef(false)

  useEffect(() => {
    if (!hasRegistered.current) {
      registerComponents()
      hasRegistered.current = true
    }
  }, [])

  return <Chart {...props} />
}
