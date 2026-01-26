# @shadcn/echarts

Apache ECharts charts styled to match shadcn/ui's design language with full dark/light mode support and excellent developer experience.

## 🚧 Work in Progress

This package is currently under active development. Phase 1 (Core Package Setup) is complete.

## Features

- 🎨 **shadcn/ui Design Language**: Charts automatically match your shadcn/ui theme
- 🌓 **Dark/Light Mode**: Seamless theme switching with automatic detection
- 📦 **Tree-shakeable**: Import only what you need for optimal bundle size
- 🔒 **Type-safe**: Full TypeScript support with ECharts' ComposeOption pattern
- ⚡ **SSR Support**: Server-side rendering utilities included
- 🎯 **Developer Experience**: Clean API with React hooks and utilities

## Installation

```bash
pnpm add @shadcn/echarts echarts react
```

## Usage

### Basic Example

```tsx
import { BarChart } from '@shadcn/echarts'
import { useEChartsTheme } from '@shadcn/echarts/hooks'

function MyChart() {
  const { theme } = useEChartsTheme()
  
  return (
    <BarChart
      data={[5, 20, 36, 10, 10, 20]}
      categories={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
      theme={theme}
    />
  )
}
```

### Theme Setup

```tsx
import { registerShadcnThemes } from '@shadcn/echarts/themes'

// Register themes on app initialization
registerShadcnThemes()
```

## Documentation

Full documentation coming soon. See the [implementation plan](.cursor/plans/shadcn-echarts_implementation_plan_44021a4f.plan.md) for current progress.

## License

MIT
