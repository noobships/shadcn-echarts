"use client"

import React from "react"
import { LineChart } from "@devstool/shadcn-echarts"
import type { LineChartProps } from "@devstool/shadcn-echarts"

export type { LineChartProps }

export function LineChartComponent(props: LineChartProps) {
  return <LineChart {...props} />
}
