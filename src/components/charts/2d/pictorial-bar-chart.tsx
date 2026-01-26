/**
 * Pictorial Bar Chart component
 */

'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { PictorialBarChart } from 'echarts/charts'
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
import type { PictorialBarChartOption } from '../../../core/types'

let registered = false

function registerComponents() {
  if (registered) return
  echarts.use([
    PictorialBarChart,
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

export interface PictorialBarChartProps extends Omit<ChartProps, 'option'> {
  option: PictorialBarChartOption
}

export function PictorialBarChartComponent(props: PictorialBarChartProps): React.JSX.Element {
  const hasRegistered = useRef(false)

  useEffect(() => {
    if (!hasRegistered.current) {
      registerComponents()
      hasRegistered.current = true
    }
  }, [])

  return <Chart {...props} />
}
