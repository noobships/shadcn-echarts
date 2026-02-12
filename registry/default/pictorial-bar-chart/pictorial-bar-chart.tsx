"use client"

import React from "react"
import { PictorialBarChart } from "@devstool/shadcn-echarts"
import type { PictorialBarChartProps } from "@devstool/shadcn-echarts"

export type { PictorialBarChartProps }

export function PictorialBarChartComponent(props: PictorialBarChartProps) {
  return <PictorialBarChart {...props} />
}
