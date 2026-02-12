# shadcn minimal chart style spec

This document defines the “polish bar” for `@devstool/shadcn-echarts`: charts should look at home inside a shadcn/ui app, in both light and dark mode, with predictable spacing, typography, and tooltips.

## Design tokens (source of truth)

The library reads shadcn/ui CSS variables from the DOM and converts them to an ECharts theme:

- **Palette**: `--chart-1` … `--chart-5`
- **Surfaces**: `--background`, `--card`, `--popover`
- **Text**: `--foreground`, `--muted-foreground`, `--popover-foreground`
- **Separators** (alpha must be preserved): `--border` (and sometimes `--input`)

## Visual spec

- **Typography**
  - `textStyle.fontFamily` matches the page font (`document.body` computed `fontFamily`)
  - Base chart text size: ~12px
  - Secondary text uses `--muted-foreground`

- **Axes / grid (cartesian charts)**
  - No axis line and no ticks by default
  - Y split lines visible by default with subtle alpha (from `--border`)
  - Consistent grid padding across charts (small, shadcn-like)

- **Series defaults (minimal, non-invasive)**
  - Defaults are applied as a **defaults-only merge** (never overwrite explicit user styling)
  - Line: `lineStyle.width = 2`, `showSymbol = false`, subtle area fills for area charts
  - Bar: rounded corners, reasonable max width
  - Pie/treemap/sunburst: separators match the container surface (`--card`)

- **Tooltip (high impact)**
  - HTML tooltip rendered as a shadcn popover:
    - `background: var(--popover)`
    - `border: 1px solid var(--border)`
    - `color: var(--popover-foreground)`
  - Values are right-aligned and displayed with tabular numerals (mono stack)

## Interaction spec

- **Theme switching is seamless**
  - Without passing a `theme` prop, toggling `.dark` on `<html>` updates charts in-place
  - Implementation detail: `setTheme()` + re-apply the last option (so defaults are recomputed)

- **Hover polish**
  - Consistent emphasis focus (`emphasis.focus = 'series'`) unless the user overrides it

## Golden set (baseline for screenshots)

The demo + visual regression suite uses a golden set of cards (IDs):

- `line-chart`
- `area-chart`
- `bar-chart`
- `pie-chart`
- `scatter-chart`
- `radar-chart`
- `heatmap-chart`
- `treemap-chart`

## Acceptance criteria (Definition of Done)

- **Alpha correctness**
  - Dark mode split lines / borders visually match the alpha intent of shadcn tokens (e.g. `--border: ... / 10%`)

- **Automatic theme behavior**
  - Toggling `.dark` updates charts without re-mounting the React component

- **Regression protection**
  - The Playwright visual suite passes in both light and dark:
    - `pnpm -C demo test:visual`
  - Intentional visual changes require updating snapshots:
    - `pnpm -C demo test:visual:update`

- **Opt-out exists**
  - Setting `preset={false}` disables the minimal defaults layer.

