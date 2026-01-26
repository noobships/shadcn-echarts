"use client"

import React from "react"
import { ScatterGLChart } from "@shadcn/echarts"
import type { ScatterGLChartProps } from "@shadcn/echarts"

export type { ScatterGLChartProps }

export function ScatterGLChartComponent(props: ScatterGLChartProps) {
  return <ScatterGLChart {...props} />
}
