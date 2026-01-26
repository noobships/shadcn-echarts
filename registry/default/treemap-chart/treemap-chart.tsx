"use client"

import React from "react"
import { TreemapChart } from "@shadcn/echarts"
import type { TreemapChartProps } from "@shadcn/echarts"

export type { TreemapChartProps }

export function TreemapChartComponent(props: TreemapChartProps) {
  return <TreemapChart {...props} />
}
