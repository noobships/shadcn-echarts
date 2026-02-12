# Presets (minimal defaults)

`@devstool/shadcn-echarts` ships with a built-in **minimal** preset that applies shadcn-style defaults to ECharts options.

## Goals

- **Defaults-only**: never overwrite explicit user-provided option values.
- **Polish out of the box**: consistent grid/axes/series/tooltip styling with shadcn/ui tokens.
- **Easy opt-out** for “raw ECharts” users.

## How it works

- All chart components ultimately render the base `Chart`.
- By default, `Chart` applies the minimal preset before calling `setOption(...)`.
- The preset also provides a shadcn-like **HTML tooltip formatter** (popover look + tabular numbers).

## Opt out

All components accept `preset?: boolean` (default `true`).

```tsx
import { BarChart } from '@devstool/shadcn-echarts'

export function RawEChartsExample() {
  return (
    <BarChart
      preset={false}
      option={{
        xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
        yAxis: { type: 'value' },
        series: [{ type: 'bar', data: [150, 230, 224] }],
      }}
    />
  )
}
```

## What the minimal preset sets (when not provided by you)

### Cartesian defaults

- `grid`: small consistent padding + `containLabel: true`
- `xAxis` / `yAxis`:
  - `axisLine.show = false`
  - `axisTick.show = false`
  - `axisLabel.margin = 10`
  - `yAxis.splitLine.show = true`

### Series defaults (examples)

- Shared:
  - `emphasis.focus = 'series'`
- `line`:
  - `showSymbol = false`
  - `symbolSize = 6`
  - `lineStyle.width = 2`
  - `areaStyle.opacity` for area charts
- `bar`:
  - `itemStyle.borderRadius = 6`
  - `barMaxWidth = 48`
- `pie`:
  - `label.show = false`, `labelLine.show = false`
  - `itemStyle.borderWidth = 1`

### Tooltip defaults

- `renderMode: 'html'`
- `appendToBody: true`
- `confine: true`
- `formatter`: shadcn-like HTML popover that uses CSS variables:
  - `var(--popover)`, `var(--popover-foreground)`, `var(--border)`, `var(--muted-foreground)`

## Overriding behavior

If you explicitly set a field, it stays untouched.

Example: you can keep the preset but fully customize a tooltip:

```tsx
<BarChart
  option={{
    tooltip: { formatter: (p) => `custom: ${String((p as any).value)}` },
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [150, 230, 224] }],
  }}
/>
```

