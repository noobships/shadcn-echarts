"use client"

import React from "react"
import { ScatterChart } from "@devstool/shadcn-echarts"
import type { ScatterChartProps } from "@devstool/shadcn-echarts"

export type { ScatterChartProps }

export function ScatterChartComponent(props: ScatterChartProps) {
  return <ScatterChart {...props} />
}
