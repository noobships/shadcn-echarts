/**
 * Globe 3D Chart component
 * 
 * Note: 3D charts may require additional setup (e.g., echarts-gl package).
 * This component provides the structure; additional dependencies may be needed.
 */

'use client'

import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GeoComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { Globe3DChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GeoComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
  ])
  registered = true
}

export interface Globe3DChartProps extends Omit<ChartProps, 'option'> {
  option: Globe3DChartOption
}

export function Globe3DChartComponent(props: Globe3DChartProps): React.JSX.Element {
  return <Chart {...props} />
}
