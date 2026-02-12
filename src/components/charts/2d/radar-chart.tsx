/**
 * Radar Chart component
 */

'use client'

import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  RadarComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { RadarChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    RadarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    RadarComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    SVGRenderer,
  ])
  registered = true
}

export interface RadarChartProps extends Omit<ChartProps, 'option'> {
  option: RadarChartOption
}

export function RadarChartComponent(props: RadarChartProps): React.JSX.Element {
  return <Chart {...props} />
}
