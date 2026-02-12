"use client"

import React from "react"
import { BarChart } from "@devstool/shadcn-echarts"
import type { BarChartProps } from "@devstool/shadcn-echarts"

export type { BarChartProps }

export function BarChartComponent(props: BarChartProps) {
  return <BarChart {...props} />
}
