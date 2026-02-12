/**
 * Lines GL Chart component (WebGL-based)
 */

'use client'

import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  GeoComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { LinesGLChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    TitleComponent,
    TooltipComponent,
    GeoComponent,
    LegendComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
  ])
  registered = true
}

export interface LinesGLChartProps extends Omit<ChartProps, 'option'> {
  option: LinesGLChartOption
}

export function LinesGLChartComponent(props: LinesGLChartProps): React.JSX.Element {
  return <Chart {...props} />
}
