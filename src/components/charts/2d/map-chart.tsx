/**
 * Map Chart component
 */

'use client'

import { useEffect, useRef } from 'react'
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
import { CanvasRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { MapChartOption } from '../../../core/types'

let registered = false

function registerComponents() {
  if (registered) return
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
  ])
  registered = true
}

export interface MapChartProps extends Omit<ChartProps, 'option'> {
  option: MapChartOption
}

export function MapChartComponent(props: MapChartProps): React.JSX.Element {
  const hasRegistered = useRef(false)

  useEffect(() => {
    if (!hasRegistered.current) {
      registerComponents()
      hasRegistered.current = true
    }
  }, [])

  return <Chart {...props} />
}
