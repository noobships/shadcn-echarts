"use client"

import React from "react"
import { SunburstChart } from "@shadcn/echarts"
import type { SunburstChartProps } from "@shadcn/echarts"

export type { SunburstChartProps }

export function SunburstChartComponent(props: SunburstChartProps) {
  return <SunburstChart {...props} />
}
