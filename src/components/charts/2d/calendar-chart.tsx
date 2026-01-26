/**
 * Calendar Chart component
 */

'use client'

import { useEffect, useRef } from 'react'
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
import { CanvasRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { CalendarChartOption } from '../../../core/types'

let registered = false

function registerComponents() {
  if (registered) return
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
  ])
  registered = true
}

export interface CalendarChartProps extends Omit<ChartProps, 'option'> {
  option: CalendarChartOption
}

export function CalendarChartComponent(props: CalendarChartProps): React.JSX.Element {
  const hasRegistered = useRef(false)

  useEffect(() => {
    if (!hasRegistered.current) {
      registerComponents()
      hasRegistered.current = true
    }
  }, [])

  return <Chart {...props} />
}
