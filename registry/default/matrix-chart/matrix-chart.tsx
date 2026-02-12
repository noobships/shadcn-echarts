"use client"

import React from "react"
import { MatrixChart } from "@devstool/shadcn-echarts"
import type { MatrixChartProps } from "@devstool/shadcn-echarts"

export type { MatrixChartProps }

export function MatrixChartComponent(props: MatrixChartProps) {
  return <MatrixChart {...props} />
}
