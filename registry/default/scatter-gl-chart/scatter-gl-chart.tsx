"use client"

import React from "react"
import { ScatterGLChart } from "@devstool/shadcn-echarts"
import type { ScatterGLChartProps } from "@devstool/shadcn-echarts"

export type { ScatterGLChartProps }

export function ScatterGLChartComponent(props: ScatterGLChartProps) {
  return <ScatterGLChart {...props} />
}
