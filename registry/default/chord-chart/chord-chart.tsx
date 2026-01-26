"use client"

import React from "react"
import { ChordChart } from "@shadcn/echarts"
import type { ChordChartProps } from "@shadcn/echarts"

export type { ChordChartProps }

export function ChordChartComponent(props: ChordChartProps) {
  return <ChordChart {...props} />
}
