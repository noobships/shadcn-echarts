"use client"

import React from "react"
import { Scatter3DChart } from "@shadcn/echarts"
import type { Scatter3DChartProps } from "@shadcn/echarts"

export type { Scatter3DChartProps }

export function Scatter3DChartComponent(props: Scatter3DChartProps) {
  return <Scatter3DChart {...props} />
}
