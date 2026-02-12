"use client"

import React from "react"
import { LinesChart } from "@devstool/shadcn-echarts"
import type { LinesChartProps } from "@devstool/shadcn-echarts"

export type { LinesChartProps }

export function LinesChartComponent(props: LinesChartProps) {
  return <LinesChart {...props} />
}
