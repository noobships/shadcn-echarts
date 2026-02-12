"use client"

import React from "react"
import { GaugeChart } from "@devstool/shadcn-echarts"
import type { GaugeChartProps } from "@devstool/shadcn-echarts"

export type { GaugeChartProps }

export function GaugeChartComponent(props: GaugeChartProps) {
  return <GaugeChart {...props} />
}
