"use client"

import React from "react"
import { PieChart } from "@shadcn/echarts"
import type { PieChartProps } from "@shadcn/echarts"

export type { PieChartProps }

export function PieChartComponent(props: PieChartProps) {
  return <PieChart {...props} />
}
