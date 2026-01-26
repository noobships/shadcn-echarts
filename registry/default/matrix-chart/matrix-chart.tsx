"use client"

import React from "react"
import { MatrixChart } from "@shadcn/echarts"
import type { MatrixChartProps } from "@shadcn/echarts"

export type { MatrixChartProps }

export function MatrixChartComponent(props: MatrixChartProps) {
  return <MatrixChart {...props} />
}
