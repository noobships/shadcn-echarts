"use client"

import React from "react"
import { ChordChart } from "@devstool/shadcn-echarts"
import type { ChordChartProps } from "@devstool/shadcn-echarts"

export type { ChordChartProps }

export function ChordChartComponent(props: ChordChartProps) {
  return <ChordChart {...props} />
}
