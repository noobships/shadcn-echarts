"use client"

import React from "react"
import { CandlestickChart } from "@shadcn/echarts"
import type { CandlestickChartProps } from "@shadcn/echarts"

export type { CandlestickChartProps }

export function CandlestickChartComponent(props: CandlestickChartProps) {
  return <CandlestickChart {...props} />
}
