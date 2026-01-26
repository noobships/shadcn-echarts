"use client"

import React from "react"
import { TreeChart } from "@shadcn/echarts"
import type { TreeChartProps } from "@shadcn/echarts"

export type { TreeChartProps }

export function TreeChartComponent(props: TreeChartProps) {
  return <TreeChart {...props} />
}
