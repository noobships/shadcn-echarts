"use client"

import React from "react"
import { ScatterChart } from "@shadcn/echarts"
import type { ScatterChartProps } from "@shadcn/echarts"

export type { ScatterChartProps }

export function ScatterChartComponent(props: ScatterChartProps) {
  return <ScatterChart {...props} />
}
