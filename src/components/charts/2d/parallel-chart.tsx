/**
 * Parallel Chart component (Parallel coordinates)
 */

'use client'

import * as echarts from 'echarts/core'
import { ParallelChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ParallelComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { ParallelChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    ParallelChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ParallelComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    SVGRenderer,
  ])
  registered = true
}

export interface ParallelChartProps extends Omit<ChartProps, 'option'> {
  option: ParallelChartOption
}

export function ParallelChartComponent(props: ParallelChartProps): React.JSX.Element {
  return <Chart {...props} />
}
