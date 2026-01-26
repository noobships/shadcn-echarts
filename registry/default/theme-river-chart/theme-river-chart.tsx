"use client"

import React from "react"
import { ThemeRiverChart } from "@shadcn/echarts"
import type { ThemeRiverChartProps } from "@shadcn/echarts"

export type { ThemeRiverChartProps }

export function ThemeRiverChartComponent(props: ThemeRiverChartProps) {
  return <ThemeRiverChart {...props} />
}
