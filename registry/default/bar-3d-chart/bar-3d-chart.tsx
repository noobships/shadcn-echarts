"use client"

import React from "react"
import { Bar3DChart } from "@shadcn/echarts"
import type { Bar3DChartProps } from "@shadcn/echarts"

export type { Bar3DChartProps }

export function Bar3DChartComponent(props: Bar3DChartProps) {
  return <Bar3DChart {...props} />
}
