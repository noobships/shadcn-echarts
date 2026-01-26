/**
 * Line Chart component
 * 
 * Tree-shakeable line chart component with proper ECharts registration
 */

'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
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
import type { LineChartOption } from '../../../core/types'

// Register required components
let registered = false

function registerComponents() {
  if (registered) {
    return
  }
  echarts.use([
    LineChart,
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

export interface LineChartProps extends Omit<ChartProps, 'option'> {
  /** Line chart option */
  option: LineChartOption
}

/**
 * Line Chart component
 * 
 * @example
 * ```tsx
 * <LineChart
 *   option={{
 *     xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
 *     yAxis: { type: 'value' },
 *     series: [{ type: 'line', data: [150, 230, 224] }]
 *   }}
 * />
 * ```
 */
export function LineChartComponent(props: LineChartProps): React.JSX.Element {
  const hasRegistered = useRef(false)

  useEffect(() => {
    if (!hasRegistered.current) {
      registerComponents()
      hasRegistered.current = true
    }
  }, [])

  return <Chart {...props} />
}
