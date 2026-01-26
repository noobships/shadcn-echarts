/**
 * Lines Chart component (Flow/Path charts)
 */

'use client'

import { useEffect, useRef } from 'react'
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
import { CanvasRenderer } from 'echarts/renderers'
import { Chart, type ChartProps } from '../../chart'
import type { LinesChartOption } from '../../../core/types'

let registered = false

function registerComponents() {
  if (registered) return
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
  ])
  registered = true
}

export interface LinesChartProps extends Omit<ChartProps, 'option'> {
  option: LinesChartOption
}

export function LinesChartComponent(props: LinesChartProps): React.JSX.Element {
  const hasRegistered = useRef(false)

  useEffect(() => {
    if (!hasRegistered.current) {
      registerComponents()
      hasRegistered.current = true
    }
  }, [])

  return <Chart {...props} />
}
