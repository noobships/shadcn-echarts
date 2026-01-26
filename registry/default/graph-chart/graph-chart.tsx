"use client"

import React from "react"
import { GraphChart } from "@shadcn/echarts"
import type { GraphChartProps } from "@shadcn/echarts"

export type { GraphChartProps }

export function GraphChartComponent(props: GraphChartProps) {
  return <GraphChart {...props} />
}
