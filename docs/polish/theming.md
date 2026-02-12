# Theming

`@devstool/shadcn-echarts` converts shadcn/ui CSS variables into ECharts themes and keeps charts in sync with light/dark mode changes.

## Theme names and modes

The library uses two built-in theme names:

- `shadcn-light`
- `shadcn-dark`

On the base `Chart`, the `theme` prop supports:

- **Auto (recommended)**: omit `theme` (default). The chart follows:
  - `.dark` class on `<html>` (highest priority)
  - `prefers-color-scheme: dark` (fallback)
- **Force shadcn themes**: `theme="light" | "dark" | "shadcn-light" | "shadcn-dark"`
- **Custom**: pass any registered ECharts theme name

## Token resolution (alpha-preserving)

shadcn/ui tokens often use `oklch(...)` and may include alpha (e.g. `oklch(1 0 0 / 10%)`).

This library resolves colors into concrete `rgb(...)` / `rgba(...)` strings:

- **Client**: `CSS.supports('color', value)` + `getComputedStyle()` (authoritative conversion)
- **SSR / fallback**: `culori` parses and formats the color

This is critical for subtle separators in dark mode (grid lines, borders, etc.).

## Automatic theme sync

The base `Chart` watches for mode changes (DOM class + media query). When the effective theme changes it:

1. Registers the shadcn theme for the current token state (idempotent)
2. Calls `setTheme(nextTheme)`
3. Re-applies the last option with `notMerge: true` so theme-derived defaults are recalculated

## Advanced: registering themes yourself

You can register themes manually (useful if you want to pre-register on app startup):

```tsx
import { registerShadcnTheme } from '@devstool/shadcn-echarts/themes'

registerShadcnTheme('light')
registerShadcnTheme('dark')
```

## SSR note

On the server you don’t have access to computed CSS variables. If you want to build a theme during SSR you can register from explicit token values:

```ts
import { registerThemeFromColors } from '@devstool/shadcn-echarts/themes'

registerThemeFromColors(
  {
    chart1: 'oklch(...)',
    chart2: 'oklch(...)',
    chart3: 'oklch(...)',
    chart4: 'oklch(...)',
    chart5: 'oklch(...)',
    background: 'oklch(...)',
    foreground: 'oklch(...)',
    muted: 'oklch(...)',
    mutedForeground: 'oklch(...)',
    border: 'oklch(1 0 0 / 10%)',
    primary: 'oklch(...)',
    primaryForeground: 'oklch(...)',
    // Optional surface tokens:
    card: 'oklch(...)',
    cardForeground: 'oklch(...)',
    popover: 'oklch(...)',
    popoverForeground: 'oklch(...)',
  },
  'dark',
  'my-dark-theme'
)
```

