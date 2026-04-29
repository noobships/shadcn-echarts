import test from 'node:test'
import assert from 'node:assert/strict'
import {
  applyMinimalPreset,
  buildEChartsTheme,
  createMountSeedOption,
  resolveColor,
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

// ---------------------------------------------------------------------------
// Regression tests for P0 behaviors
// ---------------------------------------------------------------------------

test('createMountSeedOption preserves series names and empties data', () => {
  const option = {
    series: [
      { type: 'bar', name: 'Revenue', data: [10, 20, 30] },
      { type: 'line', name: 'Profit', data: [5, 15, 25] },
    ],
  }

  const seed = createMountSeedOption(option)

  // Series names must survive so ECharts legend does not emit warnings
  assert.equal(seed.series[0].name, 'Revenue')
  assert.equal(seed.series[1].name, 'Profit')

  // Series types must survive
  assert.equal(seed.series[0].type, 'bar')
  assert.equal(seed.series[1].type, 'line')

  // Data must be emptied
  assert.deepEqual(seed.series[0].data, [])
  assert.deepEqual(seed.series[1].data, [])

  // Animation disabled on seed
  assert.equal(seed.series[0].animation, false)
  assert.equal(seed.series[1].animation, false)
  assert.equal(seed.animation, false)
})

test('createMountSeedOption empties links/nodes for graph series', () => {
  const option = {
    series: [
      {
        type: 'graph',
        name: 'Network',
        data: [{ name: 'A' }, { name: 'B' }],
        links: [{ source: 'A', target: 'B' }],
        nodes: [{ name: 'A' }, { name: 'B' }],
      },
    ],
  }

  const seed = createMountSeedOption(option)

  assert.equal(seed.series[0].name, 'Network')
  assert.deepEqual(seed.series[0].data, [])
  assert.deepEqual(seed.series[0].links, [])
  assert.deepEqual(seed.series[0].nodes, [])
})

test('createMountSeedOption handles single series object (not array)', () => {
  const option = {
    series: { type: 'pie', name: 'Share', data: [{ value: 40 }, { value: 60 }] },
  }

  const seed = createMountSeedOption(option)

  // Single series stays as single object (not wrapped in array)
  assert.equal(Array.isArray(seed.series), false)
  assert.equal(seed.series.name, 'Share')
  assert.deepEqual(seed.series.data, [])
})

test('createMountSeedOption passes through non-series fields unchanged', () => {
  const option = {
    title: { text: 'Hello' },
    xAxis: { type: 'category', data: ['Q1', 'Q2'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [10, 20] }],
  }

  const seed = createMountSeedOption(option)

  assert.equal(seed.title.text, 'Hello')
  assert.deepEqual(seed.xAxis.data, ['Q1', 'Q2'])
  assert.equal(seed.yAxis.type, 'value')
})

test('treemap preset defaults use theme-derived border color (not static gray)', () => {
  const out = applyMinimalPreset(
    { series: [{ type: 'treemap', data: [{ name: 'A', value: 10 }] }] },
    { mode: 'dark' },
  )

  const treeSeries = out.series[0]

  // borderColor must be present and not a plain gray hex
  assert.ok(treeSeries.itemStyle.borderColor)
  assert.notEqual(treeSeries.itemStyle.borderColor, '#ccc')
  assert.notEqual(treeSeries.itemStyle.borderColor, 'gray')

  // levels must be set with border defaults
  assert.ok(Array.isArray(treeSeries.levels))
  assert.ok(treeSeries.levels.length >= 2)
  assert.ok(treeSeries.levels[0].itemStyle.borderColor)

  // emphasis borderColor should exist
  assert.ok(treeSeries.emphasis.itemStyle.borderColor)
})

test('treemap preset defaults apply consistently in light mode', () => {
  const out = applyMinimalPreset(
    { series: [{ type: 'treemap', data: [{ name: 'B', value: 20 }] }] },
    { mode: 'light' },
  )

  const treeSeries = out.series[0]
  assert.ok(treeSeries.itemStyle.borderColor)
  assert.ok(treeSeries.itemStyle.gapWidth >= 1)
  assert.ok(treeSeries.breadcrumb?.show === false)
})

test('default grid never uses deprecated containLabel', () => {
  // Cartesian chart (has xAxis/yAxis)
  const cartesian = applyMinimalPreset(
    {
      xAxis: { type: 'category', data: ['A'] },
      yAxis: { type: 'value' },
      series: [{ type: 'line', data: [1] }],
    },
    { mode: 'dark' },
  )

  assert.equal(cartesian.grid.containLabel, undefined)
  assert.equal(cartesian.grid.outerBoundsMode, 'same')
  assert.equal(cartesian.grid.outerBoundsContain, 'axisLabel')

  // Non-cartesian chart (no xAxis/yAxis) should not inject grid defaults
  const nonCartesian = applyMinimalPreset(
    { series: [{ type: 'pie', data: [{ value: 50 }] }] },
    { mode: 'light' },
  )
  assert.equal(nonCartesian.grid, undefined)
})

test('resolveColor converts oklch to rgb format', () => {
  const result = resolveColor('oklch(0.62 0.22 264)')
  assert.match(result, /^rgb/)
})

test('resolveColor returns fallback for empty input', () => {
  const result = resolveColor('', { fallback: 'rgb(255, 0, 0)' })
  assert.equal(result, 'rgb(255, 0, 0)')
})

test('resolveColor preserves alpha in oklch with alpha', () => {
  const result = resolveColor('oklch(1 0 0 / 0.14)')
  // Result should be rgba with the alpha preserved
  assert.match(result, /^rgba?\(/)
})

test('resolveOptionColorTokens handles nested gradient colorStops', () => {
  const out = resolveOptionColorTokens({
    series: [
      {
        type: 'bar',
        data: [1],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'oklch(0.7 0.15 240)' },
              { offset: 1, color: 'oklch(0.5 0.12 240)' },
            ],
          },
        },
      },
    ],
  })

  const stops = out.series[0].itemStyle.color.colorStops
  assert.match(stops[0].color, /^rgb/)
  assert.match(stops[1].color, /^rgb/)
})

test('resolveOptionColorTokens leaves non-token hex colors untouched', () => {
  const out = resolveOptionColorTokens({
    series: [
      {
        type: 'line',
        data: [1],
        lineStyle: { color: '#3b82f6' },
        itemStyle: { color: 'rgb(59, 130, 246)', borderColor: '#ef4444' },
      },
    ],
  })

  assert.equal(out.series[0].lineStyle.color, '#3b82f6')
  assert.equal(out.series[0].itemStyle.color, 'rgb(59, 130, 246)')
  assert.equal(out.series[0].itemStyle.borderColor, '#ef4444')
})

test('theme treemap borderColor uses alpha-preserving color in dark mode', () => {
  const theme = buildEChartsTheme(SHADCN_TOKENS, 'dark')

  // Treemap borders should have some alpha (not fully opaque) for subtle seams
  const borderColor = theme.treemap?.itemStyle?.borderColor
  assert.ok(borderColor)
  assert.match(borderColor, /^rgba?\(/)
})

test('theme axisPointer defaults are set', () => {
  const theme = buildEChartsTheme(SHADCN_TOKENS, 'dark')

  assert.ok(theme.axisPointer?.label?.backgroundColor)
  assert.ok(theme.axisPointer?.label?.color)
  assert.ok(theme.axisPointer?.lineStyle?.color)
})

