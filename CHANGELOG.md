# @devstool/shadcn-echarts

## Unreleased

### Improvements

- Add mount animation controls in `Chart` via `animateOnMount` and `animateOnMountDelayMs` (default enabled) for more consistent first-load entrance animation.
- Improve minimal preset tooltip precedence to avoid injecting a global formatter when chart options already define tooltip formatting semantics.
- Modernize preset grid defaults for ECharts 6 by using outer-bounds containment defaults instead of relying on `grid.containLabel`.
- Expand theme and preset defaults for `sunburst`, `treemap`, and `boxplot` to improve dark/light border and contrast behavior.
- Add opt-in `resolveOptionColorTokens()` utility for resolving token-like color values in custom option trees.

## 0.2.0

### Minor Changes

- 84e44ec: Improve shadcn theme resolution and runtime theme application stability, and polish minimal preset defaults across key chart types for cleaner surfaces, tooltip consistency, and better light/dark visual parity.

## 0.1.2

### Patch Changes

- 1885d6c: Update README and registry install examples to use the production domain `shadcn-echarts.devstool.dev` instead of the previous `vercel.app` URLs.

## 0.1.1

### Patch Changes

- c7a4cb5: Prepare the first public npm release under the `@devstool` scope with registry-driven installation, release automation, and docs-site distribution updates.
