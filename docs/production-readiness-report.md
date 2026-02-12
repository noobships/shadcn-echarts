# shadcn-echarts Production Readiness Report

## Snapshot

- **Date**: 2026-02-11
- **Examples tracked from `docs/echarts/examples`**: 267
- **Supported (render path available)**: 260
- **Unsupported (explicit UI status)**: 7
- **Local bundled external assets**: 34

## What Was Implemented

### 1) Full example catalog + script generation

- Added `scripts/generate-demo-examples.mjs`.
- Generates:
  - `demo/src/generated/examples-manifest.json`
  - `demo/src/generated/examples-manifest.ts`
  - `demo/src/generated/examples-metrics.json`
  - `demo/src/generated/examples-metrics.ts`
  - `demo/public/echarts-scripts/**` (transpiled runnable scripts for every example)

### 2) Local asset bundling

- Added `scripts/fetch-demo-assets.mjs`.
- Downloads and stores external assets under `demo/public/echarts-assets/**`.
- Emits:
  - `demo/public/echarts-assets/asset-map.json`
  - `demo/src/generated/asset-map.ts`

### 3) Sidebar-first UX and route architecture

- Integrated shadcn sidebar block and migrated to route-driven shell:
  - `/` overview
  - `/examples` all examples with search/filter
  - `/category/:category` category views
  - `/unsupported` unsupported-only view
  - `/examples/:encodedId` detail view with chart rendering
- Core files:
  - `demo/src/App.tsx`
  - `demo/src/main.tsx`
  - `demo/src/components/app-sidebar.tsx`
  - `demo/src/routes/overview-page.tsx`
  - `demo/src/routes/examples-page.tsx`
  - `demo/src/routes/example-detail-page.tsx`

### 4) Proof-of-usage renderer path (`@devstool/shadcn-echarts`)

- Added chart wrapper registry and runtime evaluator:
  - `demo/src/lib/chart-registry.tsx`
  - `demo/src/lib/example-evaluator.ts`
  - `demo/src/components/example-chart-panel.tsx`
- Example scripts are evaluated to recover option payloads, then rendered via `@devstool/shadcn-echarts` components.
- UI explicitly displays runtime source path and status.

### 5) Verification and parity gates

- Added `scripts/verify-demo-parity.mjs`.
- Wired parity check into `scripts/verify-phase7.mjs`.
- Added package scripts:
  - `pnpm demo:generate-examples`
  - `pnpm demo:fetch-assets`
  - `pnpm verify:demo-parity`

## Unsupported Examples (Current)

1. `geo/map/use-lines-to-draw-1-million-new-york-streets` (`missing-local-assets`)
2. `lines/use-lines-to-draw-1-million-new-york-streets` (`missing-local-assets`)
3. `graphic/custom-graphic-component` (`no-component-mapping`)
4. `graphic/customized-loading-animation` (`no-component-mapping`)
5. `graphic/draggable-points` (`no-component-mapping`)
6. `graphic/stroke-animation` (`no-component-mapping`)
7. `graphic/wave-animation` (`no-component-mapping`)

These are surfaced with explicit unsupported messaging in UI.

## UX/UI Outcome

- App-shell now feels like a real shadcn data workbench (persistent sidebar, structured navigation, filtered browsing).
- Every example is discoverable with deterministic status.
- Detail pages provide a focused single-example workspace with adaptive chart container sizing (no fixed clipping card behavior).
- Light/dark theming remains shadcn-token based and consistent with package intent.

## Production-Readiness Evidence

### Coverage proof

- `verify-demo-parity` confirms 1:1 coverage between `docs/echarts/examples` and generated demo manifest/scripts.

### Integration proof

- Supported examples render through `@devstool/shadcn-echarts` wrappers, not ad hoc chart init components in the demo page shell.

### Quality proof

- `SKIP_VISUAL=1 node scripts/verify-phase7.mjs` passes including parity gate.
- `pnpm -C demo build` passes.

### Visual baseline status

- Visual test suite was expanded to category-level parity and representative light/dark screenshots in `demo/tests/visual.spec.ts`.
- In this environment, Playwright browser installation was not completed (user skipped install), so snapshot generation is pending:
  - Required command: `pnpm -C demo exec playwright install chromium`
  - Then: `pnpm -C demo test:visual:update`

## Recommendation

- **Ready for controlled production usage** for the currently supported corpus, with explicit unsupported handling in place.
- Before broad production claim, finish:
  1. unresolved large NYC-lines asset pipeline for the two remaining data-heavy lines/geo examples,
  2. `graphic/*` wrapper strategy (or permanent unsupported policy),
  3. Playwright baseline generation and CI pass.
