"use client"

import React from "react"
import { SankeyChart } from "@shadcn/echarts"
import type { SankeyChartProps } from "@shadcn/echarts"

export type { SankeyChartProps }

export function SankeyChartComponent(props: SankeyChartProps) {
  return <SankeyChart {...props} />
}
