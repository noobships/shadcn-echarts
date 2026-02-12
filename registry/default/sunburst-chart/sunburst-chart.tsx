"use client"

import React from "react"
import { SunburstChart } from "@devstool/shadcn-echarts"
import type { SunburstChartProps } from "@devstool/shadcn-echarts"

export type { SunburstChartProps }

export function SunburstChartComponent(props: SunburstChartProps) {
  return <SunburstChart {...props} />
}
