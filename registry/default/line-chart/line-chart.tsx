"use client"

import React from "react"
import { LineChart } from "@shadcn/echarts"
import type { LineChartProps } from "@shadcn/echarts"

export type { LineChartProps }

export function LineChartComponent(props: LineChartProps) {
  return <LineChart {...props} />
}
