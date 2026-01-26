"use client"

import React from "react"
import { ParallelChart } from "@shadcn/echarts"
import type { ParallelChartProps } from "@shadcn/echarts"

export type { ParallelChartProps }

export function ParallelChartComponent(props: ParallelChartProps) {
  return <ParallelChart {...props} />
}
