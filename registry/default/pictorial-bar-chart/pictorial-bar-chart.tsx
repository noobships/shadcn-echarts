"use client"

import React from "react"
import { PictorialBarChart } from "@shadcn/echarts"
import type { PictorialBarChartProps } from "@shadcn/echarts"

export type { PictorialBarChartProps }

export function PictorialBarChartComponent(props: PictorialBarChartProps) {
  return <PictorialBarChart {...props} />
}
