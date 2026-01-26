"use client"

import React from "react"
import { Surface3DChart } from "@shadcn/echarts"
import type { Surface3DChartProps } from "@shadcn/echarts"

export type { Surface3DChartProps }

export function Surface3DChartComponent(props: Surface3DChartProps) {
  return <Surface3DChart {...props} />
}
