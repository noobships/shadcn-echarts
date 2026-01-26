"use client"

import React from "react"
import { Globe3DChart } from "@shadcn/echarts"
import type { Globe3DChartProps } from "@shadcn/echarts"

export type { Globe3DChartProps }

export function Globe3DChartComponent(props: Globe3DChartProps) {
  return <Globe3DChart {...props} />
}
