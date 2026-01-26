"use client"

import React from "react"
import { Line3DChart } from "@shadcn/echarts"
import type { Line3DChartProps } from "@shadcn/echarts"

export type { Line3DChartProps }

export function Line3DChartComponent(props: Line3DChartProps) {
  return <Line3DChart {...props} />
}
