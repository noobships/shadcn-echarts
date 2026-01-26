/**
 * Sankey Chart component
 */

'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { SankeyChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { SankeyChartOption } from '../../../core/types'

let registered = false

function registerComponents() {
  if (registered) return
  echarts.use([
    SankeyChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
  ])
  registered = true
}

export interface SankeyChartProps extends Omit<ChartProps, 'option'> {
  option: SankeyChartOption
}

export function SankeyChartComponent(props: SankeyChartProps): React.JSX.Element {
  const hasRegistered = useRef(false)

  useEffect(() => {
    if (!hasRegistered.current) {
      registerComponents()
      hasRegistered.current = true
    }
  }, [])

  return <Chart {...props} />
}
