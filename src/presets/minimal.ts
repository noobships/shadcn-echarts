import type { EChartsCoreOption } from "echarts/core";
import type { ThemeMode } from "../themes/types";
import { resolveColor } from "../themes/resolveColor";

type AnyRecord = Record<string, any>;

export interface MinimalPresetContext {
  mode: ThemeMode;
}

function isPlainObject(value: unknown): value is AnyRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Merge `defaults` into `value` without overwriting user-provided fields.
 * Arrays are not deep-merged (handled explicitly where needed).
 */
function mergeDefaults<T>(value: T, defaults: any): T {
  if (value === undefined) {
    return defaults as T;
  }

  if (!isPlainObject(value) || !isPlainObject(defaults)) {
    return value;
  }

  const out: AnyRecord = { ...defaults };

  for (const [key, val] of Object.entries(value)) {
    if (val === undefined) {
      continue;
    }

    const def = (defaults as AnyRecord)[key];
    if (isPlainObject(val) && isPlainObject(def)) {
      out[key] = mergeDefaults(val, def);
    } else {
      out[key] = val;
    }
  }

  return out as T;
}

function withAlpha(color: string, alpha: number): string {
  const match = color.match(/rgba?\(([^)]+)\)/i);
  if (!match) {
    return color;
  }

  const channels = match[1];
  if (!channels) {
    return color;
  }
  const parts = channels.split(",").map((part) => part.trim());
  if (parts.length < 3) {
    return color;
  }

  return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
}

function cssTokenColor(name: string, fallback: string): string {
  if (typeof document === "undefined") {
    return fallback;
  }

  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return resolveColor(value, { fallback });
}

function asArray<T>(value: T | T[] | undefined): T[] | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value : [value];
}

function restoreArrayOrSingle<T>(
  original: T | T[] | undefined,
  next: T[],
): T | T[] | undefined {
  if (original === undefined) return undefined;
  return Array.isArray(original) ? next : next[0];
}

function escapeHtml(input: unknown): string {
  const str = String(input ?? "");
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatNumber(n: number): string {
  try {
    return n.toLocaleString();
  } catch {
    return String(n);
  }
}

function formatTooltipValue(value: unknown): string {
  if (value == null) return "";

  if (typeof value === "number") {
    return formatNumber(value);
  }

  if (typeof value === "string") {
    return value;
  }

  // Common ECharts shapes:
  // - scatter: [x, y] or [x, y, size]
  // - candlestick: [open, close, low, high]
  if (Array.isArray(value)) {
    const last = value[value.length - 1];
    if (typeof last === "number") {
      return formatNumber(last);
    }
    return escapeHtml(value.join(", "));
  }

  if (isPlainObject(value)) {
    const maybe = (value as AnyRecord).value;
    if (maybe !== undefined) {
      return formatTooltipValue(maybe);
    }
  }

  return escapeHtml(String(value));
}

function getTooltipColor(param: any): string {
  const c = param?.color;
  if (typeof c === "string") return c;

  // Gradients / complex colors (best-effort)
  const stops = c?.colorStops;
  const firstStop = Array.isArray(stops) ? stops[0]?.color : undefined;
  if (typeof firstStop === "string") return firstStop;

  return "currentColor";
}

function tooltipHeader(params: any): string {
  if (Array.isArray(params) && params.length > 0) {
    const first = params[0];
    return first?.axisValueLabel ?? first?.name ?? first?.axisValue ?? "";
  }

  return params?.name ?? params?.seriesName ?? "";
}

function tooltipItems(
  params: any,
): Array<{ label: string; value: string; color: string }> {
  const list = Array.isArray(params) ? params : [params];

  return list.filter(Boolean).map((p) => ({
    label: p?.seriesName ?? p?.name ?? "Value",
    value: formatTooltipValue(p?.value ?? p?.data?.value ?? p?.data),
    color: getTooltipColor(p),
  }));
}

function tooltipContainerStyle(): string {
  return [
    "min-width: 8rem",
    "border: 1px solid var(--border)",
    "background: var(--popover)",
    "color: var(--popover-foreground)",
    "border-radius: 0.625rem",
    "padding: 0.375rem 0.625rem",
    "box-shadow: 0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)",
    "font-size: 0.75rem",
    "line-height: 1.2",
  ].join(";");
}

function shadcnHtmlTooltipFormatter(params: any): string {
  const header = escapeHtml(tooltipHeader(params));
  const items = tooltipItems(params);

  const headerHtml = header
    ? `<div style="font-weight: 500; margin-bottom: 0.375rem;">${header}</div>`
    : "";

  const rows = items
    .map((item) => {
      const label = escapeHtml(item.label);
      const value = escapeHtml(item.value);
      const color = escapeHtml(item.color);
      return `
        <div style="display:flex; align-items:center; justify-content:space-between; gap: 0.75rem;">
          <div style="display:flex; align-items:center; gap: 0.5rem; min-width: 0;">
            <span style="width:0.625rem; height:0.625rem; border-radius:0.25rem; background:${color}; flex: 0 0 auto;"></span>
            <span style="color: var(--muted-foreground); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${label}</span>
          </div>
          <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-variant-numeric: tabular-nums; font-weight: 500;">
            ${value}
          </span>
        </div>
      `;
    })
    .join("");

  return `<div style="${tooltipContainerStyle()}">${headerHtml}<div style="display:grid; gap: 0.375rem;">${rows}</div></div>`;
}

function hasTooltipFormatting(tooltip: unknown): boolean {
  if (!isPlainObject(tooltip)) {
    return false;
  }

  return tooltip.formatter !== undefined || tooltip.valueFormatter !== undefined;
}

function hasSeriesTooltipFormatting(series: unknown): boolean {
  const list = asArray(series as AnyRecord | AnyRecord[] | undefined);
  if (!list) {
    return false;
  }

  return list.some((entry) => isPlainObject(entry) && hasTooltipFormatting(entry.tooltip));
}

function isCartesianOption(option: AnyRecord): boolean {
  return (
    option.xAxis !== undefined ||
    option.yAxis !== undefined ||
    option.grid !== undefined
  );
}

function applyAxisDefaults(axis: any): any {
  const axes = asArray<any>(axis);
  if (!axes) return axis;

  const next = axes.map((a) =>
    mergeDefaults(a, {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { margin: 10 },
    }),
  );

  return restoreArrayOrSingle(axis, next);
}

function getAxisAtIndex(axis: any, axisIndex: unknown): AnyRecord | undefined {
  const axes = asArray<any>(axis);
  if (!axes || axes.length === 0) {
    return undefined;
  }
  const index =
    typeof axisIndex === "number" && Number.isInteger(axisIndex) && axisIndex >= 0
      ? axisIndex
      : 0;
  return (axes[index] ?? axes[0]) as AnyRecord | undefined;
}

function inferBarOrientation(series: AnyRecord, option: AnyRecord): "horizontal" | "vertical" | "polar" {
  if (series.coordinateSystem === "polar") {
    return "polar";
  }
  if (series.layout === "horizontal") {
    return "horizontal";
  }
  if (series.layout === "vertical") {
    return "vertical";
  }

  const xAxis = getAxisAtIndex(option.xAxis, series.xAxisIndex);
  const yAxis = getAxisAtIndex(option.yAxis, series.yAxisIndex);

  if ((yAxis?.type ?? "") === "category" && (xAxis?.type ?? "") !== "category") {
    return "horizontal";
  }
  return "vertical";
}

function defaultBarBorderRadius(series: AnyRecord, option: AnyRecord): number | [number, number, number, number] {
  const orientation = inferBarOrientation(series, option);
  if (orientation === "polar") {
    return 6;
  }

  // Default to fully rounded bars so stacked segments keep rounded corners too.
  return [6, 6, 6, 6];
}

type MinimalSeriesVisualDefaults = {
  borderColor: string;
  emphasisBorderColor: string;
  boxplotFillColor: string;
};

function applySeriesDefaults(
  series: any,
  option: AnyRecord,
  visualDefaults?: MinimalSeriesVisualDefaults,
): any {
  const list = asArray<any>(series);
  if (!list) return series;

  const borderColor = visualDefaults?.borderColor ?? "rgba(100, 116, 139, 0.2)";
  const emphasisBorderColor = visualDefaults?.emphasisBorderColor ?? borderColor;
  const boxplotFillColor = visualDefaults?.boxplotFillColor ?? "rgba(99, 102, 241, 0.24)";

  const next = list.map((s) => {
    const type = s?.type;

    // Defaults shared across most series (safe no-op for unsupported types)
    const base = mergeDefaults(s, {
      emphasis: { focus: "series" },
    });

    if (type === "line") {
      const isArea = base?.areaStyle !== undefined;
      return mergeDefaults(base, {
        showSymbol: false,
        symbolSize: 6,
        lineStyle: { width: 2 },
        ...(isArea ? { areaStyle: { opacity: 0.18 } } : {}),
      });
    }

    if (type === "bar") {
      return mergeDefaults(base, {
        barMaxWidth: 48,
        itemStyle: { borderRadius: defaultBarBorderRadius(base, option) },
      });
    }

    if (type === "scatter") {
      return mergeDefaults(base, {
        symbolSize: 8,
      });
    }

    if (type === "pie") {
      return mergeDefaults(base, {
        avoidLabelOverlap: true,
        label: { show: true, fontSize: 12 },
        labelLine: { show: true },
        itemStyle: { borderWidth: 0.5 },
      });
    }

    if (type === "radar") {
      return mergeDefaults(base, {
        symbolSize: 4,
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.12 },
      });
    }

    if (type === "heatmap") {
      return mergeDefaults(base, {
        itemStyle: {
          borderWidth: 0,
          borderColor: "transparent",
          borderRadius: 2,
        },
        label: { show: false },
        emphasis: { focus: "self" },
      });
    }

    if (type === "treemap") {
      return mergeDefaults(base, {
        itemStyle: { borderWidth: 0.5, gapWidth: 1, borderColor },
        emphasis: {
          itemStyle: {
            borderColor: emphasisBorderColor,
          },
        },
        label: { overflow: "truncate" },
        breadcrumb: { show: false },
        levels: [
          { itemStyle: { borderWidth: 0, gapWidth: 1, borderColor } },
          { itemStyle: { gapWidth: 1, borderColor } },
          { itemStyle: { gapWidth: 1, borderColor } },
        ],
      });
    }

    if (type === "sunburst") {
      return mergeDefaults(base, {
        itemStyle: { borderWidth: 0.5, borderColor },
        label: { overflow: "truncate", fontSize: 11 },
        radius: ["15%", "90%"],
      });
    }

    if (type === "gauge") {
      return mergeDefaults(base, {
        radius: "80%",
        startAngle: 200,
        endAngle: -20,
        progress: { show: true, width: 12, roundCap: true },
        pointer: { show: false },
        axisLine: { roundCap: true, lineStyle: { width: 12 } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        title: { show: false },
        detail: {
          valueAnimation: true,
          fontSize: 26,
          fontWeight: 600,
          offsetCenter: [0, "4%"],
        },
      });
    }

    if (type === "sankey") {
      return mergeDefaults(base, {
        nodeGap: 12,
        nodeWidth: 20,
        layoutIterations: 32,
        label: { fontSize: 11 },
        lineStyle: { opacity: 0.4, curveness: 0.5 },
        emphasis: { focus: "adjacency" },
      });
    }

    if (type === "graph") {
      return mergeDefaults(base, {
        symbolSize: 30,
        label: { show: true, fontSize: 11, position: "right" },
        lineStyle: { curveness: 0.1, opacity: 0.6 },
        roam: true,
        emphasis: { focus: "adjacency" },
        force: { repulsion: 200, edgeLength: [80, 200] },
      });
    }

    if (type === "tree") {
      return mergeDefaults(base, {
        symbolSize: 8,
        label: { fontSize: 11 },
        lineStyle: { width: 1.5, curveness: 0.5 },
        emphasis: { focus: "descendant" },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,
        initialTreeDepth: 3,
      });
    }

    if (type === "funnel") {
      return mergeDefaults(base, {
        left: "10%",
        width: "80%",
        sort: "descending",
        gap: 4,
        label: { show: true, position: "inside", fontSize: 12 },
        labelLine: { show: false },
        itemStyle: { borderWidth: 0 },
        emphasis: { label: { fontSize: 14 } },
      });
    }

    if (type === "candlestick") {
      return mergeDefaults(base, {
        itemStyle: { borderWidth: 1 },
        barMaxWidth: 20,
      });
    }

    if (type === "boxplot") {
      return mergeDefaults(base, {
        itemStyle: {
          borderWidth: 1,
          borderColor: emphasisBorderColor,
          color: boxplotFillColor,
        },
      });
    }

    if (type === "pictorialBar") {
      return mergeDefaults(base, {
        barMaxWidth: 48,
      });
    }

    if (type === "themeRiver") {
      return mergeDefaults(base, {
        label: { fontSize: 10 },
        emphasis: { focus: "self" },
      });
    }

    if (type === "parallel") {
      return mergeDefaults(base, {
        lineStyle: { width: 1.5, opacity: 0.5 },
        smooth: true,
      });
    }

    if (type === "lines") {
      return mergeDefaults(base, {
        lineStyle: { width: 1.5, opacity: 0.6, curveness: 0.2 },
      });
    }

    return base;
  });

  return restoreArrayOrSingle(series, next);
}

/**
 * Apply the built-in "shadcn minimal" preset as defaults-only merges.
 * This never overwrites explicit user styling.
 */
export function applyMinimalPreset(
  option: EChartsCoreOption,
  ctx: MinimalPresetContext,
): EChartsCoreOption {
  const base = option as AnyRecord;

  const cartesian = isCartesianOption(base);
  const borderColor = cssTokenColor(
    "--border",
    ctx.mode === "dark" ? "rgba(148, 163, 184, 0.28)" : "rgba(100, 116, 139, 0.2)",
  );
  const emphasisBorderColor = cssTokenColor(
    "--primary",
    ctx.mode === "dark" ? "rgb(129, 140, 248)" : "rgb(99, 102, 241)",
  );
  const chartColor = cssTokenColor(
    "--chart-1",
    ctx.mode === "dark" ? "rgb(129, 140, 248)" : "rgb(99, 102, 241)",
  );
  const boxplotFillColor = withAlpha(chartColor, ctx.mode === "dark" ? 0.42 : 0.24);
  const tooltipBackgroundColor = cssTokenColor(
    "--popover",
    ctx.mode === "dark" ? "rgb(15, 23, 42)" : "rgb(255, 255, 255)",
  );
  const tooltipBorderColor = borderColor;
  const tooltipTextColor = cssTokenColor(
    "--popover-foreground",
    ctx.mode === "dark" ? "rgb(241, 245, 249)" : "rgb(15, 23, 42)",
  );
  const tooltipBase = base.tooltip === null ? undefined : base.tooltip;

  // Respect user tooltip formatting at top-level and series-level.
  const userHasTooltipFormatting =
    hasTooltipFormatting(tooltipBase) || hasSeriesTooltipFormatting(base.series);

  const tooltipDefaults: AnyRecord = {
    renderMode: "html",
    appendToBody: true,
    confine: true,
    ...(cartesian ? { trigger: "axis" } : { trigger: "item" }),
  };

  if (!userHasTooltipFormatting) {
    // Use our custom HTML popover formatter with transparent bg
    // (the formatter renders its own styled container)
    tooltipDefaults.padding = 0;
    tooltipDefaults.borderWidth = 0;
    tooltipDefaults.backgroundColor = "transparent";
    tooltipDefaults.extraCssText =
      "padding:0;border:0;background:transparent;box-shadow:none;border-radius:0;";
    tooltipDefaults.formatter = shadcnHtmlTooltipFormatter;
  } else {
    // User has their own formatter — apply standard themed tooltip styling
    tooltipDefaults.padding = [6, 10];
    tooltipDefaults.borderWidth = 1;
    tooltipDefaults.borderRadius = 10;
    tooltipDefaults.backgroundColor = tooltipBackgroundColor;
    tooltipDefaults.borderColor = tooltipBorderColor;
    tooltipDefaults.textStyle = { color: tooltipTextColor };
    tooltipDefaults.extraCssText =
      "border-radius:0.625rem;box-shadow:0 10px 15px -3px rgba(0,0,0,0.10),0 4px 6px -4px rgba(0,0,0,0.10);";
  }

  const out: AnyRecord = {
    ...base,
    grid: cartesian
      ? mergeDefaults(base.grid, {
          left: 12,
          right: 12,
          top: 8,
          bottom: 12,
          outerBoundsMode: "same",
          outerBoundsContain: "axisLabel",
        })
      : base.grid,
    xAxis: cartesian ? applyAxisDefaults(base.xAxis) : base.xAxis,
    yAxis: cartesian
      ? ((): any => {
          const y = applyAxisDefaults(base.yAxis);
          const ys = asArray<any>(y);
          if (!ys) return y;
          const next = ys.map((a) =>
            mergeDefaults(a, {
              splitLine: { show: true },
            }),
          );
          for (const axis of next) {
            if (isPlainObject(axis) && axis.type === "category") {
              axis.splitLine = mergeDefaults(axis.splitLine, { show: false });
            }
          }
          return restoreArrayOrSingle(y, next);
        })()
      : base.yAxis,
    tooltip: mergeDefaults(tooltipBase, tooltipDefaults),
    series: applySeriesDefaults(base.series, base, {
      borderColor,
      emphasisBorderColor,
      boxplotFillColor,
    }),
  };

  // Radar component defaults (top-level `radar` config, not series)
  if (base.radar !== undefined) {
    out.radar = mergeDefaults(base.radar, {
      shape: "circle",
      splitNumber: 4,
      axisName: { fontSize: 11 },
    });
  }

  // Calendar component defaults
  if (base.calendar !== undefined) {
    out.calendar = mergeDefaults(base.calendar, {
      cellSize: ["auto", 14],
      itemStyle: { borderWidth: 0, borderColor: "transparent" },
      yearLabel: { show: false },
      dayLabel: { firstDay: 1, fontSize: 10 },
      monthLabel: { fontSize: 10 },
    });
  }

  return out as EChartsCoreOption;
}
