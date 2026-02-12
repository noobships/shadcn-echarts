"use client"

import React from "react"
import { TreeChart } from "@devstool/shadcn-echarts"
import type { TreeChartProps } from "@devstool/shadcn-echarts"

export type { TreeChartProps }

export function TreeChartComponent(props: TreeChartProps) {
  return <TreeChart {...props} />
}
