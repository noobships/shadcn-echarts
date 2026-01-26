"use client"

import React from "react"
import { LinesChart } from "@shadcn/echarts"
import type { LinesChartProps } from "@shadcn/echarts"

export type { LinesChartProps }

export function LinesChartComponent(props: LinesChartProps) {
  return <LinesChart {...props} />
}
