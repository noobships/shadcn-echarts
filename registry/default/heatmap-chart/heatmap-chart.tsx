"use client"

import React from "react"
import { HeatmapChart } from "@devstool/shadcn-echarts"
import type { HeatmapChartProps } from "@devstool/shadcn-echarts"

export type { HeatmapChartProps }

export function HeatmapChartComponent(props: HeatmapChartProps) {
  return <HeatmapChart {...props} />
}
