"use client"

import React from "react"
import { PieChart } from "@devstool/shadcn-echarts"
import type { PieChartProps } from "@devstool/shadcn-echarts"

export type { PieChartProps }

export function PieChartComponent(props: PieChartProps) {
  return <PieChart {...props} />
}
