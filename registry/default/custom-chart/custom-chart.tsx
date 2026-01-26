"use client"

import React from "react"
import { CustomChart } from "@shadcn/echarts"
import type { CustomChartProps } from "@shadcn/echarts"

export type { CustomChartProps }

export function CustomChartComponent(props: CustomChartProps) {
  return <CustomChart {...props} />
}
