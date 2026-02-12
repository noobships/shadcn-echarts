# @devstool/shadcn-echarts

Apache ECharts components styled to match shadcn/ui design language with automatic light/dark theming, minimal defaults, and tree-shakeable chart exports.

## What you get

- shadcn-style visual language with CSS variable driven theming
- Auto dark/light mode sync
- Defaults-only minimal preset that does not override explicit styling
- Tree-shakeable per-chart imports
- npm package + shadcn registry distribution

## Installation methods

### 1) npm package

```bash
pnpm add @devstool/shadcn-echarts echarts react
```

### 2) shadcn direct URL install

```bash
npx shadcn@latest add https://shadcn-echarts.devstool.dev/r/bar-chart.json
```

### 3) shadcn namespace install

Add a registry namespace in your `components.json`:

```json
{
  "registries": {
    "@devstool": "https://shadcn-echarts.devstool.dev/r/{name}.json"
  }
}
```

Then install by namespace:

```bash
npx shadcn@latest add @devstool/bar-chart
```

### 4) Manual source ownership

Copy files from `registry/default/*` into your project and customize freely.

## Usage

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

## Local development

```bash
# library build/watch
pnpm build
pnpm dev

# registry assets for docs site
pnpm registry:build
pnpm registry:verify

# public docs website
pnpm www:dev
pnpm www:build

# interactive demo workspace
pnpm -C demo dev
```

## Registry endpoints

- Registry index: `/registry.json`
- Registry items: `/r/<component>.json`

On Vercel this resolves to:

- `https://shadcn-echarts.devstool.dev/registry.json`
- `https://shadcn-echarts.devstool.dev/r/bar-chart.json`

## Project docs

- `docs/polish/style-spec.md`
- `docs/polish/presets.md`
- `docs/polish/theming.md`
- `docs/release/vercel-github-checklist.md`

## License

MIT
