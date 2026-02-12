/**
 * Matrix Chart component
 */

'use client'

import * as echarts from 'echarts/core'
import { HeatmapChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { MatrixChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    HeatmapChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    VisualMapComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    SVGRenderer,
  ])
  registered = true
}

export interface MatrixChartProps extends Omit<ChartProps, 'option'> {
  option: MatrixChartOption
}

export function MatrixChartComponent(props: MatrixChartProps): React.JSX.Element {
  return <Chart {...props} />
}
