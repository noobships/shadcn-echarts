/**
 * Sankey Chart component
 */

'use client'

import * as echarts from 'echarts/core'
import { SankeyChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { SankeyChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    SankeyChart,
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

export interface SankeyChartProps extends Omit<ChartProps, 'option'> {
  option: SankeyChartOption
}

export function SankeyChartComponent(props: SankeyChartProps): React.JSX.Element {
  return <Chart {...props} />
}
