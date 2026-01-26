"use client"

import React from "react"
import { BoxplotChart } from "@shadcn/echarts"
import type { BoxplotChartProps } from "@shadcn/echarts"

export type { BoxplotChartProps }

export function BoxplotChartComponent(props: BoxplotChartProps) {
  return <BoxplotChart {...props} />
}
