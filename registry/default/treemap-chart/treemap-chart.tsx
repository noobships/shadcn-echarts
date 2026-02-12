"use client"

import React from "react"
import { TreemapChart } from "@devstool/shadcn-echarts"
import type { TreemapChartProps } from "@devstool/shadcn-echarts"

export type { TreemapChartProps }

export function TreemapChartComponent(props: TreemapChartProps) {
  return <TreemapChart {...props} />
}
