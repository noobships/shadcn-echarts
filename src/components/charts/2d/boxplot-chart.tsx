/**
 * Boxplot Chart component
 */

'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { BoxplotChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { BoxplotChartOption } from '../../../core/types'

let registered = false

function registerComponents() {
  if (registered) return
  echarts.use([
    BoxplotChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
  ])
  registered = true
}

export interface BoxplotChartProps extends Omit<ChartProps, 'option'> {
  option: BoxplotChartOption
}

export function BoxplotChartComponent(props: BoxplotChartProps): React.JSX.Element {
  const hasRegistered = useRef(false)

  useEffect(() => {
    if (!hasRegistered.current) {
      registerComponents()
      hasRegistered.current = true
    }
  }, [])

  return <Chart {...props} />
}
