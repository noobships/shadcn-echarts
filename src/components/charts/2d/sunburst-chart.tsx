/**
 * Sunburst Chart component
 */

'use client'

import * as echarts from 'echarts/core'
import { SunburstChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { SunburstChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    SunburstChart,
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

export interface SunburstChartProps extends Omit<ChartProps, 'option'> {
  option: SunburstChartOption
}

export function SunburstChartComponent(props: SunburstChartProps): React.JSX.Element {
  return <Chart {...props} />
}
