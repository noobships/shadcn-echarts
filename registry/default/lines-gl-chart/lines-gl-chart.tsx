"use client"

import React from "react"
import { LinesGLChart } from "@devstool/shadcn-echarts"
import type { LinesGLChartProps } from "@devstool/shadcn-echarts"

export type { LinesGLChartProps }

export function LinesGLChartComponent(props: LinesGLChartProps) {
  return <LinesGLChart {...props} />
}
