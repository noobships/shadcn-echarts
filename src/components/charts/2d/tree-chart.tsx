/**
 * Tree Chart component
 */

'use client'

import * as echarts from 'echarts/core'
import { TreeChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { TreeChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    TreeChart,
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

export interface TreeChartProps extends Omit<ChartProps, 'option'> {
  option: TreeChartOption
}

export function TreeChartComponent(props: TreeChartProps): React.JSX.Element {
  return <Chart {...props} />
}
