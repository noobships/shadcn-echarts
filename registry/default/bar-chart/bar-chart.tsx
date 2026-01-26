"use client"

import React from "react"
import { BarChart } from "@shadcn/echarts"
import type { BarChartProps } from "@shadcn/echarts"

export type { BarChartProps }

export function BarChartComponent(props: BarChartProps) {
  return <BarChart {...props} />
}
