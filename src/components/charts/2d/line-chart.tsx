/**
 * Line Chart component
 * 
 * Tree-shakeable line chart component with proper ECharts registration
 */

'use client'

import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { LineChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    LineChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    PolarComponent,
    LegendComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    SVGRenderer,
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
  return <Chart {...props} />
}
