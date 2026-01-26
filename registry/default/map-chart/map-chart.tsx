"use client"

import React from "react"
import { MapChart } from "@shadcn/echarts"
import type { MapChartProps } from "@shadcn/echarts"

export type { MapChartProps }

export function MapChartComponent(props: MapChartProps) {
  return <MapChart {...props} />
}
