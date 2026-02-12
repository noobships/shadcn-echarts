"use client"

import React from "react"
import { FunnelChart } from "@devstool/shadcn-echarts"
import type { FunnelChartProps } from "@devstool/shadcn-echarts"

export type { FunnelChartProps }

export function FunnelChartComponent(props: FunnelChartProps) {
  return <FunnelChart {...props} />
}
