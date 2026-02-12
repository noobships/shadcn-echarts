"use client"

import React from "react"
import { GraphGLChart } from "@devstool/shadcn-echarts"
import type { GraphGLChartProps } from "@devstool/shadcn-echarts"

export type { GraphGLChartProps }

export function GraphGLChartComponent(props: GraphGLChartProps) {
  return <GraphGLChart {...props} />
}
