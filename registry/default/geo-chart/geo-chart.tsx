"use client"

import React from "react"
import { GeoChart } from "@shadcn/echarts"
import type { GeoChartProps } from "@shadcn/echarts"

export type { GeoChartProps }

export function GeoChartComponent(props: GeoChartProps) {
  return <GeoChart {...props} />
}
