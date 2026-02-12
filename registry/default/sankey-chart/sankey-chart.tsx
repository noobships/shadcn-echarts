"use client"

import React from "react"
import { SankeyChart } from "@devstool/shadcn-echarts"
import type { SankeyChartProps } from "@devstool/shadcn-echarts"

export type { SankeyChartProps }

export function SankeyChartComponent(props: SankeyChartProps) {
  return <SankeyChart {...props} />
}
