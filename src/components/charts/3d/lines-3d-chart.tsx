/**
 * Lines 3D Chart component
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
import type { Lines3DChartOption } from '../../../core/types'

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

export interface Lines3DChartProps extends Omit<ChartProps, 'option'> {
  option: Lines3DChartOption
}

export function Lines3DChartComponent(props: Lines3DChartProps): React.JSX.Element {
  return <Chart {...props} />
}
