/**
 * Theme River Chart component
 */

'use client'

import * as echarts from 'echarts/core'
import { ThemeRiverChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  SingleAxisComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { ThemeRiverChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    ThemeRiverChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    SingleAxisComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    SVGRenderer,
  ])
  registered = true
}

export interface ThemeRiverChartProps extends Omit<ChartProps, 'option'> {
  option: ThemeRiverChartOption
}

export function ThemeRiverChartComponent(props: ThemeRiverChartProps): React.JSX.Element {
  return <Chart {...props} />
}
