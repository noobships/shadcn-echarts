/**
 * Parallel Chart component (Parallel coordinates)
 */

'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { ParallelChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ParallelComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { ParallelChartOption } from '../../../core/types'

let registered = false

function registerComponents() {
  if (registered) return
  echarts.use([
    ParallelChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ParallelComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
  ])
  registered = true
}

export interface ParallelChartProps extends Omit<ChartProps, 'option'> {
  option: ParallelChartOption
}

export function ParallelChartComponent(props: ParallelChartProps): React.JSX.Element {
  const hasRegistered = useRef(false)

  useEffect(() => {
    if (!hasRegistered.current) {
      registerComponents()
      hasRegistered.current = true
    }
  }, [])

  return <Chart {...props} />
}
