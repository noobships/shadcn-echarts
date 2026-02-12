/**
 * Treemap Chart component
 */

'use client'

import * as echarts from 'echarts/core'
import { TreemapChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { TreemapChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    TreemapChart,
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

export interface TreemapChartProps extends Omit<ChartProps, 'option'> {
  option: TreemapChartOption
}

export function TreemapChartComponent(props: TreemapChartProps): React.JSX.Element {
  return <Chart {...props} />
}
