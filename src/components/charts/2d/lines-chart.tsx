/**
 * Lines Chart component (Flow/Path charts)
 */

'use client'

import * as echarts from 'echarts/core'
import { LinesChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GeoComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { LinesChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    LinesChart,
    TitleComponent,
    TooltipComponent,
    GeoComponent,
    LegendComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    SVGRenderer,
  ])
  registered = true
}

export interface LinesChartProps extends Omit<ChartProps, 'option'> {
  option: LinesChartOption
}

export function LinesChartComponent(props: LinesChartProps): React.JSX.Element {
  return <Chart {...props} />
}
