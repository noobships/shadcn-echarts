"use client"

import React from "react"
import { BoxplotChart } from "@devstool/shadcn-echarts"
import type { BoxplotChartProps } from "@devstool/shadcn-echarts"

export type { BoxplotChartProps }

export function BoxplotChartComponent(props: BoxplotChartProps) {
  return <BoxplotChart {...props} />
}
