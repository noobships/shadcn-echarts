"use client"

import React from "react"
import { FunnelChart } from "@shadcn/echarts"
import type { FunnelChartProps } from "@shadcn/echarts"

export type { FunnelChartProps }

export function FunnelChartComponent(props: FunnelChartProps) {
  return <FunnelChart {...props} />
}
