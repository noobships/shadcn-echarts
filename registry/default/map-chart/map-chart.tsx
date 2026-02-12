"use client"

import React from "react"
import { MapChart } from "@devstool/shadcn-echarts"
import type { MapChartProps } from "@devstool/shadcn-echarts"

export type { MapChartProps }

export function MapChartComponent(props: MapChartProps) {
  return <MapChart {...props} />
}
