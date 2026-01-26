"use client"

import React from "react"
import { RadarChart } from "@shadcn/echarts"
import type { RadarChartProps } from "@shadcn/echarts"

export type { RadarChartProps }

export function RadarChartComponent(props: RadarChartProps) {
  return <RadarChart {...props} />
}
