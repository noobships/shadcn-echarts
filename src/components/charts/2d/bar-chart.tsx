/**
 * Bar Chart component
 * 
 * Tree-shakeable bar chart component with proper ECharts registration
 */

'use client'

import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
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
import type { BarChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    BarChart,
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
  return <Chart {...props} />
}
