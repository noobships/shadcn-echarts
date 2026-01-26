"use client"

import React from "react"
import { LinesGLChart } from "@shadcn/echarts"
import type { LinesGLChartProps } from "@shadcn/echarts"

export type { LinesGLChartProps }

export function LinesGLChartComponent(props: LinesGLChartProps) {
  return <LinesGLChart {...props} />
}
