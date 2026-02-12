"use client"

import React from "react"
import { RadarChart } from "@devstool/shadcn-echarts"
import type { RadarChartProps } from "@devstool/shadcn-echarts"

export type { RadarChartProps }

export function RadarChartComponent(props: RadarChartProps) {
  return <RadarChart {...props} />
}
