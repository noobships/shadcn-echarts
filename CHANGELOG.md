# @devstool/shadcn-echarts

## 0.4.0

### Minor Changes

- 7cf29ec: Add `ChartProvider` and `useChartDefaults` for global chart configuration.

  Teams can now wrap their app in `<ChartProvider>` to set shared defaults for `preset`, `theme`, `renderer`, `autoResize`, `animateOnMount`, and `animateOnMountDelayMs` — no need to repeat props on every chart instance.

  Also adds axisPointer theme defaults for crosshair label styling and a comprehensive regression test suite covering mount animation, CSS variable resolution, treemap seam defaults, and ECharts 6 grid compatibility.

## 0.3.0

### Minor Changes

- 9253263: Ship first-load chart animation controls and improve default visual parity.

  This release adds `animateOnMount` and `animateOnMountDelayMs`, improves minimal preset behavior for tooltip precedence and ECharts 6 grid containment, expands sunburst/treemap/boxplot defaults for better light-dark contrast, and adds an opt-in `resolveOptionColorTokens()` utility for token-like custom option colors.

## 0.2.0

### Minor Changes

- 84e44ec: Improve shadcn theme resolution and runtime theme application stability, and polish minimal preset defaults across key chart types for cleaner surfaces, tooltip consistency, and better light/dark visual parity.

## 0.1.2

### Patch Changes

- 1885d6c: Update README and registry install examples to use the production domain `shadcn-echarts.devstool.dev` instead of the previous `vercel.app` URLs.

## 0.1.1

### Patch Changes

- c7a4cb5: Prepare the first public npm release under the `@devstool` scope with registry-driven installation, release automation, and docs-site distribution updates.
