/**
 * Calendar Chart component
 */

'use client'

import * as echarts from 'echarts/core'
import { HeatmapChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  CalendarComponent,
  VisualMapComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { CalendarChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    HeatmapChart,
    TitleComponent,
    TooltipComponent,
    CalendarComponent,
    VisualMapComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    SVGRenderer,
  ])
  registered = true
}

export interface CalendarChartProps extends Omit<ChartProps, 'option'> {
  option: CalendarChartOption
}

export function CalendarChartComponent(props: CalendarChartProps): React.JSX.Element {
  return <Chart {...props} />
}
