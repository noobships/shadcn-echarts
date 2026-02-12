/**
 * Boxplot Chart component
 */

'use client'

import * as echarts from 'echarts/core'
import { BoxplotChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { BoxplotChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    BoxplotChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    SVGRenderer,
  ])
  registered = true
}

export interface BoxplotChartProps extends Omit<ChartProps, 'option'> {
  option: BoxplotChartOption
}

export function BoxplotChartComponent(props: BoxplotChartProps): React.JSX.Element {
  return <Chart {...props} />
}
