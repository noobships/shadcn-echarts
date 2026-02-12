/**
 * Line 3D Chart component
 */

'use client'

import * as echarts from 'echarts/core'
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
import type { Line3DChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
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

export interface Line3DChartProps extends Omit<ChartProps, 'option'> {
  option: Line3DChartOption
}

export function Line3DChartComponent(props: Line3DChartProps): React.JSX.Element {
  return <Chart {...props} />
}
