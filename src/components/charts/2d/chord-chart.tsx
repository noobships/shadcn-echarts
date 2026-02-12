/**
 * Chord Chart component
 */

'use client'

import * as echarts from 'echarts/core'
import { ChordChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { ChordChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    ChordChart,
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

export interface ChordChartProps extends Omit<ChartProps, 'option'> {
  option: ChordChartOption
}

export function ChordChartComponent(props: ChordChartProps): React.JSX.Element {
  return <Chart {...props} />
}
