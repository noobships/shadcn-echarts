"use client"

import React from "react"
import { ParallelChart } from "@devstool/shadcn-echarts"
import type { ParallelChartProps } from "@devstool/shadcn-echarts"

export type { ParallelChartProps }

export function ParallelChartComponent(props: ParallelChartProps) {
  return <ParallelChart {...props} />
}
