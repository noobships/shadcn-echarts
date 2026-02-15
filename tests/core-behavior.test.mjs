import test from 'node:test'
import assert from 'node:assert/strict'
import {
  applyMinimalPreset,
  buildEChartsTheme,
  resolveOptionColorTokens,
} from '../dist/index.js'

const SHADCN_TOKENS = {
  chart1: 'oklch(0.62 0.22 264)',
  chart2: 'oklch(0.71 0.14 232)',
  chart3: 'oklch(0.73 0.18 152)',
  chart4: 'oklch(0.78 0.19 80)',
  chart5: 'oklch(0.67 0.24 12)',
  background: 'oklch(0.14 0.02 262)',
  foreground: 'oklch(0.96 0.01 262)',
  card: 'oklch(0.19 0.03 262)',
  cardForeground: 'oklch(0.96 0.01 262)',
  popover: 'oklch(0.17 0.02 262)',
  popoverForeground: 'oklch(0.96 0.01 262)',
  muted: 'oklch(0.24 0.02 262)',
  mutedForeground: 'oklch(0.72 0.02 262)',
  border: 'oklch(1 0 0 / 0.14)',
  input: 'oklch(1 0 0 / 0.14)',
  primary: 'oklch(0.62 0.22 264)',
  primaryForeground: 'oklch(0.98 0.01 262)',
}

test('theme includes sunburst/treemap/boxplot defaults', () => {
  const theme = buildEChartsTheme(SHADCN_TOKENS, 'dark')

  assert.ok(theme.sunburst?.itemStyle?.borderColor)
  assert.ok(theme.treemap?.itemStyle?.borderColor)
  assert.ok(theme.boxplot?.itemStyle?.color)
  assert.ok(theme.boxplot?.itemStyle?.borderColor)
})

test('minimal preset applies ECharts 6 outer bounds grid defaults', () => {
  const out = applyMinimalPreset(
    {
      xAxis: { type: 'category', data: ['Q1'] },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: [120] }],
    },
    { mode: 'light' },
  )

  assert.equal(out.grid.containLabel, undefined)
  assert.equal(out.grid.outerBoundsMode, 'same')
  assert.equal(out.grid.outerBoundsContain, 'axisLabel')
})

test('minimal preset does not inject global formatter when series tooltip formatting exists', () => {
  const seriesValueFormatter = (value) => `${value} units`
  const out = applyMinimalPreset(
    {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['Q1'] },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'bar',
          data: [120],
          tooltip: {
            valueFormatter: seriesValueFormatter,
          },
        },
      ],
    },
    { mode: 'light' },
  )

  assert.equal(out.tooltip.formatter, undefined)
  assert.equal(out.series[0].tooltip.valueFormatter, seriesValueFormatter)
})

test('minimal preset keeps top-level formatter and still injects fallback formatter when needed', () => {
  const customFormatter = () => 'hello'

  const withCustom = applyMinimalPreset(
    {
      tooltip: { formatter: customFormatter },
      xAxis: { type: 'category', data: ['Q1'] },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: [120] }],
    },
    { mode: 'dark' },
  )

  const fallback = applyMinimalPreset(
    {
      xAxis: { type: 'category', data: ['Q1'] },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: [120] }],
    },
    { mode: 'dark' },
  )

  assert.equal(withCustom.tooltip.formatter, customFormatter)
  assert.equal(typeof fallback.tooltip.formatter, 'function')
})

test('resolveOptionColorTokens resolves token-like option colors', () => {
  const out = resolveOptionColorTokens({
    title: {
      textStyle: { color: 'oklch(0.7 0.15 240)' },
    },
    series: [
      {
        type: 'line',
        data: [1, 2, 3],
        lineStyle: { color: 'oklch(0.61 0.21 260)' },
        itemStyle: { borderColor: 'oklch(0.55 0.14 145)' },
      },
    ],
  })

  assert.match(out.title.textStyle.color, /^rgb/)
  assert.match(out.series[0].lineStyle.color, /^rgb/)
  assert.match(out.series[0].itemStyle.borderColor, /^rgb/)

  const untouched = resolveOptionColorTokens({
    series: [{ type: 'line', data: [1], lineStyle: { color: '#ff0000' } }],
  })
  assert.equal(untouched.series[0].lineStyle.color, '#ff0000')
})

