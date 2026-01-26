"use client"

import React from "react"
import { CalendarChart } from "@shadcn/echarts"
import type { CalendarChartProps } from "@shadcn/echarts"

export type { CalendarChartProps }

export function CalendarChartComponent(props: CalendarChartProps) {
  return <CalendarChart {...props} />
}
