"use client"

import React from "react"
import { AreaChart } from "@shadcn/echarts"
import type { AreaChartProps } from "@shadcn/echarts"

export type { AreaChartProps }

export function AreaChartComponent(props: AreaChartProps) {
  return <AreaChart {...props} />
}
