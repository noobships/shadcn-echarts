"use client"

import React from "react"
import { CalendarChart } from "@devstool/shadcn-echarts"
import type { CalendarChartProps } from "@devstool/shadcn-echarts"

export type { CalendarChartProps }

export function CalendarChartComponent(props: CalendarChartProps) {
  return <CalendarChart {...props} />
}
