"use client"

import React from "react"
import { HeatmapChart } from "@shadcn/echarts"
import type { HeatmapChartProps } from "@shadcn/echarts"

export type { HeatmapChartProps }

export function HeatmapChartComponent(props: HeatmapChartProps) {
  return <HeatmapChart {...props} />
}
