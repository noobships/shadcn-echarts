"use client"

import React from "react"
import { AreaChart } from "@devstool/shadcn-echarts"
import type { AreaChartProps } from "@devstool/shadcn-echarts"

export type { AreaChartProps }

export function AreaChartComponent(props: AreaChartProps) {
  return <AreaChart {...props} />
}
