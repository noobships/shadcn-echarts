/**
 * Scatter Chart component
 */

'use client'

import * as echarts from 'echarts/core'
import { EffectScatterChart, ScatterChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  SingleAxisComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { ScatterChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    ScatterChart,
    EffectScatterChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    PolarComponent,
    SingleAxisComponent,
    LegendComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    SVGRenderer,
  ])
  registered = true
}

export interface ScatterChartProps extends Omit<ChartProps, 'option'> {
  option: ScatterChartOption
}

export function ScatterChartComponent(props: ScatterChartProps): React.JSX.Element {
  return <Chart {...props} />
}
