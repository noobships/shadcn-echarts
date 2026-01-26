"use client"

import React from "react"
import { Lines3DChart } from "@shadcn/echarts"
import type { Lines3DChartProps } from "@shadcn/echarts"

export type { Lines3DChartProps }

export function Lines3DChartComponent(props: Lines3DChartProps) {
  return <Lines3DChart {...props} />
}
