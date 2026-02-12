"use client"

import React from "react"
import { ThemeRiverChart } from "@devstool/shadcn-echarts"
import type { ThemeRiverChartProps } from "@devstool/shadcn-echarts"

export type { ThemeRiverChartProps }

export function ThemeRiverChartComponent(props: ThemeRiverChartProps) {
  return <ThemeRiverChart {...props} />
}
