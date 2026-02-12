/**
 * Funnel Chart component
 */

'use client'

import * as echarts from 'echarts/core'
import { FunnelChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { FunnelChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    FunnelChart,
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

export interface FunnelChartProps extends Omit<ChartProps, 'option'> {
  option: FunnelChartOption
}

export function FunnelChartComponent(props: FunnelChartProps): React.JSX.Element {
  return <Chart {...props} />
}
