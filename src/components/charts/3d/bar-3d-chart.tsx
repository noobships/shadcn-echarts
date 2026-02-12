/**
 * Bar 3D Chart component
 * 
 * Note: 3D charts may require additional setup (e.g., echarts-gl package).
 * This component provides the structure; additional dependencies may be needed.
 */

'use client'

import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { Bar3DChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    VisualMapComponent,
    LegendComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
  ])
  registered = true
}

export interface Bar3DChartProps extends Omit<ChartProps, 'option'> {
  option: Bar3DChartOption
}

export function Bar3DChartComponent(props: Bar3DChartProps): React.JSX.Element {
  return <Chart {...props} />
}
