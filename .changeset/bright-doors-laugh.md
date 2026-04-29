---
"@devstool/shadcn-echarts": minor
---

Add `ChartProvider` and `useChartDefaults` for global chart configuration.

Teams can now wrap their app in `<ChartProvider>` to set shared defaults for `preset`, `theme`, `renderer`, `autoResize`, `animateOnMount`, and `animateOnMountDelayMs` — no need to repeat props on every chart instance.

Also adds axisPointer theme defaults for crosshair label styling and a comprehensive regression test suite covering mount animation, CSS variable resolution, treemap seam defaults, and ECharts 6 grid compatibility.
