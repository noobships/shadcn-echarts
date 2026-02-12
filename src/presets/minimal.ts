import type { EChartsCoreOption } from "echarts/core";
import type { ThemeMode } from "../themes/types";

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

function shadcnHtmlTooltipFormatter(params: any): string {
  const header = escapeHtml(tooltipHeader(params));
  const items = tooltipItems(params);

  const containerStyle = [
    "min-width: 8rem",
    "border: 1px solid var(--border)",
    "background: var(--popover)",
    "color: var(--popover-foreground)",
    "border-radius: 0.5rem",
    "padding: 0.375rem 0.625rem",
    "box-shadow: 0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)",
    "font-size: 0.75rem",
    "line-height: 1.2",
  ].join(";");

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

  return `<div style="${containerStyle}">${headerHtml}<div style="display:grid; gap: 0.375rem;">${rows}</div></div>`;
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

function applySeriesDefaults(series: any): any {
  const list = asArray<any>(series);
  if (!list) return series;

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
        itemStyle: { borderRadius: 6 },
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
        itemStyle: { borderWidth: 1 },
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
        emphasis: { focus: "self" },
      });
    }

    if (type === "treemap") {
      return mergeDefaults(base, {
        itemStyle: { borderWidth: 1, gapWidth: 2 },
        label: { overflow: "truncate" },
        breadcrumb: { show: false },
        levels: [
          { itemStyle: { borderWidth: 0, gapWidth: 2 } },
          { itemStyle: { gapWidth: 1 } },
          { itemStyle: { gapWidth: 1 } },
        ],
      });
    }

    if (type === "sunburst") {
      return mergeDefaults(base, {
        itemStyle: { borderWidth: 1 },
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
        axisLine: { lineStyle: { width: 12 } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        title: { show: false },
        detail: {
          valueAnimation: true,
          fontSize: 28,
          fontWeight: 600,
          offsetCenter: [0, "0%"],
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
        itemStyle: { borderWidth: 1.5 },
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

  // Check if user has provided their own tooltip formatter
  const userHasFormatter =
    isPlainObject(base.tooltip) && base.tooltip.formatter !== undefined;

  const tooltipDefaults: AnyRecord = {
    renderMode: "html",
    appendToBody: true,
    confine: true,
    ...(cartesian ? { trigger: "axis" } : { trigger: "item" }),
  };

  if (!userHasFormatter) {
    // Use our custom HTML popover formatter with transparent bg
    // (the formatter renders its own styled container)
    tooltipDefaults.padding = 0;
    tooltipDefaults.borderWidth = 0;
    tooltipDefaults.backgroundColor = "transparent";
    tooltipDefaults.formatter = shadcnHtmlTooltipFormatter;
  } else {
    // User has their own formatter — apply standard themed tooltip styling
    tooltipDefaults.padding = [6, 10];
    tooltipDefaults.borderWidth = 1;
  }

  const out: AnyRecord = {
    ...base,
    grid: cartesian
      ? mergeDefaults(base.grid, {
          left: 12,
          right: 12,
          top: 8,
          bottom: 12,
          containLabel: true,
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
          return restoreArrayOrSingle(y, next);
        })()
      : base.yAxis,
    tooltip: mergeDefaults(base.tooltip, tooltipDefaults),
    series: applySeriesDefaults(base.series),
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
      cellSize: ["auto", 16],
      itemStyle: { borderWidth: 0.5 },
      yearLabel: { show: false },
      dayLabel: { firstDay: 1, fontSize: 10 },
      monthLabel: { fontSize: 10 },
    });
  }

  // Future: use ctx.mode for mode-specific tweaks.
  void ctx;

  return out as EChartsCoreOption;
}
