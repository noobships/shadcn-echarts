"use client"

import React from "react"
import { Map3DChart } from "@devstool/shadcn-echarts"
import type { Map3DChartProps } from "@devstool/shadcn-echarts"

export type { Map3DChartProps }

export function Map3DChartComponent(props: Map3DChartProps) {
  return <Map3DChart {...props} />
}
