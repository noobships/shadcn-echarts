"use client"

import React from "react"
import { CandlestickChart } from "@devstool/shadcn-echarts"
import type { CandlestickChartProps } from "@devstool/shadcn-echarts"

export type { CandlestickChartProps }

export function CandlestickChartComponent(props: CandlestickChartProps) {
  return <CandlestickChart {...props} />
}
