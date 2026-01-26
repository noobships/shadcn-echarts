"use client"

import React from "react"
import { GraphGLChart } from "@shadcn/echarts"
import type { GraphGLChartProps } from "@shadcn/echarts"

export type { GraphGLChartProps }

export function GraphGLChartComponent(props: GraphGLChartProps) {
  return <GraphGLChart {...props} />
}
