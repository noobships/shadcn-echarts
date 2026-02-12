/**
 * Pie Chart component
 * 
 * Tree-shakeable pie chart component with proper ECharts registration
 */

'use client'

import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { PieChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    SVGRenderer,
  ])
  registered = true
}

export interface PieChartProps extends Omit<ChartProps, 'option'> {
  /** Pie chart option */
  option: PieChartOption
}

/**
 * Pie Chart component
 * 
 * @example
 * ```tsx
 * <PieChart
 *   option={{
 *     series: [{
 *       type: 'pie',
 *       data: [
 *         { value: 1048, name: 'Search Engine' },
 *         { value: 735, name: 'Direct' },
 *         { value: 580, name: 'Email' }
 *       ]
 *     }]
 *   }}
 * />
 * ```
 */
export function PieChartComponent(props: PieChartProps): React.JSX.Element {
  return <Chart {...props} />
}
