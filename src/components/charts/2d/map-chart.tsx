/**
 * Map Chart component
 */

'use client'

import * as echarts from 'echarts/core'
import { MapChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GeoComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { MapChartOption } from '../../../core/types'

// Register required components synchronously at module load
let registered = false
if (!registered) {
  echarts.use([
    MapChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GeoComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    SVGRenderer,
  ])
  registered = true
}

export interface MapChartProps extends Omit<ChartProps, 'option'> {
  option: MapChartOption
}

export function MapChartComponent(props: MapChartProps): React.JSX.Element {
  return <Chart {...props} />
}
