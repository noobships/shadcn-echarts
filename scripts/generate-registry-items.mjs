#!/usr/bin/env node

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const charts = {
  '2d': [
    { name: 'pie-chart', title: 'Pie Chart', optionType: 'PieChartOption' },
    { name: 'scatter-chart', title: 'Scatter Chart', optionType: 'ScatterChartOption' },
    { name: 'area-chart', title: 'Area Chart', optionType: 'AreaChartOption' },
    { name: 'map-chart', title: 'Map Chart', optionType: 'MapChartOption' },
    { name: 'geo-chart', title: 'Geo Chart', optionType: 'GeoChartOption' },
    { name: 'candlestick-chart', title: 'Candlestick Chart', optionType: 'CandlestickChartOption' },
    { name: 'radar-chart', title: 'Radar Chart', optionType: 'RadarChartOption' },
    { name: 'boxplot-chart', title: 'Boxplot Chart', optionType: 'BoxplotChartOption' },
    { name: 'heatmap-chart', title: 'Heatmap Chart', optionType: 'HeatmapChartOption' },
    { name: 'graph-chart', title: 'Graph Chart', optionType: 'GraphChartOption' },
    { name: 'lines-chart', title: 'Lines Chart', optionType: 'LinesChartOption' },
    { name: 'tree-chart', title: 'Tree Chart', optionType: 'TreeChartOption' },
    { name: 'treemap-chart', title: 'Treemap Chart', optionType: 'TreemapChartOption' },
    { name: 'sunburst-chart', title: 'Sunburst Chart', optionType: 'SunburstChartOption' },
    { name: 'parallel-chart', title: 'Parallel Chart', optionType: 'ParallelChartOption' },
    { name: 'sankey-chart', title: 'Sankey Chart', optionType: 'SankeyChartOption' },
    { name: 'funnel-chart', title: 'Funnel Chart', optionType: 'FunnelChartOption' },
    { name: 'gauge-chart', title: 'Gauge Chart', optionType: 'GaugeChartOption' },
    { name: 'pictorial-bar-chart', title: 'Pictorial Bar Chart', optionType: 'PictorialBarChartOption' },
    { name: 'theme-river-chart', title: 'Theme River Chart', optionType: 'ThemeRiverChartOption' },
    { name: 'calendar-chart', title: 'Calendar Chart', optionType: 'CalendarChartOption' },
    { name: 'matrix-chart', title: 'Matrix Chart', optionType: 'MatrixChartOption' },
    { name: 'chord-chart', title: 'Chord Chart', optionType: 'ChordChartOption' },
    { name: 'custom-chart', title: 'Custom Chart', optionType: 'CustomChartOption' },
  ],
  '3d': [
    { name: 'globe-3d-chart', title: 'Globe 3D Chart', optionType: 'Globe3DChartOption' },
    { name: 'bar-3d-chart', title: 'Bar 3D Chart', optionType: 'Bar3DChartOption' },
    { name: 'scatter-3d-chart', title: 'Scatter 3D Chart', optionType: 'Scatter3DChartOption' },
    { name: 'surface-3d-chart', title: 'Surface 3D Chart', optionType: 'Surface3DChartOption' },
    { name: 'map-3d-chart', title: 'Map 3D Chart', optionType: 'Map3DChartOption' },
    { name: 'lines-3d-chart', title: 'Lines 3D Chart', optionType: 'Lines3DChartOption' },
    { name: 'line-3d-chart', title: 'Line 3D Chart', optionType: 'Line3DChartOption' },
    { name: 'scatter-gl-chart', title: 'Scatter GL Chart', optionType: 'ScatterGLChartOption' },
    { name: 'lines-gl-chart', title: 'Lines GL Chart', optionType: 'LinesGLChartOption' },
    { name: 'graph-gl-chart', title: 'Graph GL Chart', optionType: 'GraphGLChartOption' },
  ],
}

const registryBase = 'registry/default'

function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function generateComponent(chart) {
  const componentName = toPascalCase(chart.name.replace('-chart', '').replace('-3d', '3D').replace('-gl', 'GL'))
  const importName = componentName.replace('3D', '3D').replace('GL', 'GL')
  
  return `"use client"

import type { CSSProperties } from "react"
import { ${importName}Chart } from "@shadcn/echarts"
import type { ${chart.optionType} } from "@shadcn/echarts"

export interface ${componentName}ChartProps {
  option: ${chart.optionType}
  className?: string
  style?: CSSProperties
  width?: number | string
  height?: number | string
  theme?: string
  loading?: boolean
  autoResize?: boolean
}

export function ${componentName}ChartComponent({
  option,
  className,
  style,
  width,
  height,
  theme,
  loading,
  autoResize,
}: ${componentName}ChartProps) {
  return (
    <${importName}Chart
      option={option}
      className={className}
      style={style}
      width={width}
      height={height}
      theme={theme}
      loading={loading}
      autoResize={autoResize}
    />
  )
}
`
}

function generateJSON(chart) {
  return JSON.stringify({
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: chart.name,
    type: "registry:component",
    title: chart.title,
    description: `${chart.title} component built with Apache ECharts, styled to match shadcn/ui's design language with automatic dark/light mode support.`,
    dependencies: ["@shadcn/echarts", "echarts@^6.0.0", "react@>=18.0.0"],
    files: [
      {
        path: `${registryBase}/${chart.name}/${chart.name}.tsx`,
        type: "registry:component"
      }
    ]
  }, null, 2)
}

// Generate all registry items
for (const [, chartList] of Object.entries(charts)) {
  for (const chart of chartList) {
    const dir = join(registryBase, chart.name)
    mkdirSync(dir, { recursive: true })
    
    const componentPath = join(dir, `${chart.name}.tsx`)
    const jsonPath = join(dir, `${chart.name}.json`)
    
    writeFileSync(componentPath, generateComponent(chart))
    writeFileSync(jsonPath, generateJSON(chart))
    
    console.log(`Generated: ${chart.name}`)
  }
}

console.log('All registry items generated!')
