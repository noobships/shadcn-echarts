"use client"

import React from "react"
import { GeoChart } from "@devstool/shadcn-echarts"
import type { GeoChartProps } from "@devstool/shadcn-echarts"

export type { GeoChartProps }

export function GeoChartComponent(props: GeoChartProps) {
  return <GeoChart {...props} />
}
