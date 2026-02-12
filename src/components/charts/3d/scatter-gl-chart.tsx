/**
 * Scatter GL Chart component (WebGL-based)
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
import type { ScatterGLChartOption } from '../../../core/types'

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

export interface ScatterGLChartProps extends Omit<ChartProps, 'option'> {
  option: ScatterGLChartOption
}

export function ScatterGLChartComponent(props: ScatterGLChartProps): React.JSX.Element {
  return <Chart {...props} />
}
