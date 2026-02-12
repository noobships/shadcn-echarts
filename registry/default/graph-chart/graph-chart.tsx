"use client"

import React from "react"
import { GraphChart } from "@devstool/shadcn-echarts"
import type { GraphChartProps } from "@devstool/shadcn-echarts"

export type { GraphChartProps }

export function GraphChartComponent(props: GraphChartProps) {
  return <GraphChart {...props} />
}
