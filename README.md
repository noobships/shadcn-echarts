# @devstool/shadcn-echarts

<div align="left">

**Beautiful shadcn-style ECharts components.**

[![License](https://img.shields.io/badge/License-MIT-white?style=for-the-badge&logo=opensourceinitiative&logoColor=black)](./LICENSE)
[![npm](https://img.shields.io/badge/npm-@devstool/shadcn--echarts-000000?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/@devstool/shadcn-echarts)
[![React](https://img.shields.io/badge/React-000000?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-000000?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Apache ECharts](https://img.shields.io/badge/Apache_ECharts-000000?style=for-the-badge)](https://echarts.apache.org/)
[![Website](https://img.shields.io/badge/Website-shadcn--echarts.devstool.dev-white?style=for-the-badge)](https://shadcn-echarts.devstool.dev)

</div>

`@devstool/shadcn-echarts` started from a personal need: getting Apache ECharts breadth with a modern, minimal shadcn/ui look without rebuilding setup from scratch.

Maintained by **[@noobships](https://github.com/noobships)** under the **devstool** brand.

## Quick Links

- Official website: [https://shadcn-echarts.devstool.dev](https://shadcn-echarts.devstool.dev)
- Live demo app: [https://shadcn-echarts-demo.devstool.dev/dashboard](https://shadcn-echarts-demo.devstool.dev/dashboard)
- npm package: [https://www.npmjs.com/package/@devstool/shadcn-echarts](https://www.npmjs.com/package/@devstool/shadcn-echarts)
- Demo repository: [https://github.com/noobships/shadcn-echarts-demo](https://github.com/noobships/shadcn-echarts-demo)
- Issues: [https://github.com/noobships/shadcn-echarts/issues](https://github.com/noobships/shadcn-echarts/issues)

## Why This Project Exists

- shadcn-style chart components that feel native in modern dashboards
- Automatic dark/light mode behavior
- Minimal defaults that do not fight your own explicit styles
- Tree-shakeable exports to keep bundle size clean
- Multiple installation paths: npm package, shadcn registry, or manual ownership

## Installation

### Option 1: Install from npm (recommended)

```bash
pnpm add @devstool/shadcn-echarts echarts react
```

### Option 2: Install a component from registry URL

```bash
npx shadcn@latest add https://shadcn-echarts.devstool.dev/r/bar-chart.json
```

### Option 3: Install with `@devstool` shadcn namespace

Add this to your `components.json`:

```json
{
  "registries": {
    "@devstool": "https://shadcn-echarts.devstool.dev/r/{name}.json"
  }
}
```

Then run:

```bash
npx shadcn@latest add @devstool/bar-chart
```

### Option 4: Manual source ownership

Copy files from `registry/default/*` into your project, then modify as needed.

## Quick Usage

```tsx
import { BarChart } from "@devstool/shadcn-echarts";

export function MyChart() {
  return (
    <BarChart
      option={{
        xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
        yAxis: { type: "value" },
        series: [{ type: "bar", data: [150, 230, 224] }],
      }}
      height={320}
    />
  );
}
```

## 2D vs 3D/WebGL Support

- 2D charts work out of the box with `echarts`.
- 3D/WebGL charts are supported, but require the `echarts-gl` plugin.
- Browsers already provide WebGL. You do not install WebGL directly.
- 3D support is currently early and not yet battle-tested across many real-world apps.

### Enable 3D/WebGL charts

```bash
pnpm add echarts-gl
```

Import `echarts-gl` once in a client entry (for example, your app provider or client layout wrapper):

```tsx
'use client'
import 'echarts-gl'
```

## Local Development

### Requirements

- Node.js 18+
- pnpm 9+

### Setup

```bash
pnpm install
```

### Core scripts

```bash
# Build library once
pnpm build

# Watch-mode library build
pnpm dev

# Type checks
pnpm type-check

# Lint
pnpm lint
pnpm lint:fix
```

### Registry and docs site

```bash
# Build and verify shadcn registry assets
pnpm registry:build
pnpm registry:verify

# Run docs website (apps/www)
pnpm www:dev
pnpm www:build
```

### Demo workspace

```bash
pnpm -C demo dev
```

## Repository Layout

```txt
src/                 # Core chart components, hooks, themes, presets
registry/            # shadcn registry source files
apps/www/            # Public docs/registry website
demo/                # Standalone demo app + visual tests
docs/                # Internal docs (style, presets, theming, release)
scripts/             # Build and verification scripts
```

## Registry Endpoints

- Index: `https://shadcn-echarts.devstool.dev/registry.json`
- Item format: `https://shadcn-echarts.devstool.dev/r/<component>.json`

## Contributing

Contributions are welcome. Start here: [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Issues and Feedback

Open an issue: [https://github.com/noobships/shadcn-echarts/issues](https://github.com/noobships/shadcn-echarts/issues)

## License

MIT License. See [`LICENSE`](./LICENSE).
