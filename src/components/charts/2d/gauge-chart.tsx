/**
 * Gauge Chart component
 */

'use client'

import * as echarts from 'echarts/core'
import { GaugeChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { GaugeChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    GaugeChart,
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

export interface GaugeChartProps extends Omit<ChartProps, 'option'> {
  option: GaugeChartOption
}

export function GaugeChartComponent(props: GaugeChartProps): React.JSX.Element {
  return <Chart {...props} />
}
