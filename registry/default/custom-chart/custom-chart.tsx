"use client"

import React from "react"
import { CustomChart } from "@devstool/shadcn-echarts"
import type { CustomChartProps } from "@devstool/shadcn-echarts"

export type { CustomChartProps }

export function CustomChartComponent(props: CustomChartProps) {
  return <CustomChart {...props} />
}
