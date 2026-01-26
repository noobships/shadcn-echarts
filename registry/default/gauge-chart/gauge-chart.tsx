"use client"

import React from "react"
import { GaugeChart } from "@shadcn/echarts"
import type { GaugeChartProps } from "@shadcn/echarts"

export type { GaugeChartProps }

export function GaugeChartComponent(props: GaugeChartProps) {
  return <GaugeChart {...props} />
}
