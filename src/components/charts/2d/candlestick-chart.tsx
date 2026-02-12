/**
 * Candlestick Chart component
 */

'use client'

import * as echarts from 'echarts/core'
import { CandlestickChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { CandlestickChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    CandlestickChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    SVGRenderer,
  ])
  registered = true
}

export interface CandlestickChartProps extends Omit<ChartProps, 'option'> {
  option: CandlestickChartOption
}

export function CandlestickChartComponent(props: CandlestickChartProps): React.JSX.Element {
  return <Chart {...props} />
}
