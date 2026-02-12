import { applyMinimalPreset, getThemeMode, resolveColor } from "@devstool/shadcn-echarts";
import type { EChartsCoreOption } from "echarts/core";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function deepClone<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item)) as T;
  }

  if (isRecord(value)) {
    const out: UnknownRecord = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = deepClone(item);
    }
    return out as T;
  }

  return value;
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function fromArray<T>(original: T | T[] | undefined, next: T[]): T | T[] | undefined {
  if (original === undefined) {
    return undefined;
  }
  return Array.isArray(original) ? next : next[0];
}

function mergeDefined(base: unknown, patch: UnknownRecord): UnknownRecord {
  const out: UnknownRecord = isRecord(base) ? { ...base } : {};
  for (const [key, value] of Object.entries(patch)) {
    if (value !== undefined) {
      out[key] = value;
    }
  }
  return out;
}

function mergeDefaults(base: unknown, defaults: UnknownRecord): UnknownRecord {
  const out: UnknownRecord = isRecord(base) ? { ...base } : {};
  for (const [key, value] of Object.entries(defaults)) {
    if (value !== undefined && out[key] === undefined) {
      out[key] = value;
    }
  }
  return out;
}

function withAlpha(color: string, alpha: number): string {
  const match = color.match(/rgba?\(([^)]+)\)/i);
  if (!match) {
    return color;
  }

  const parts = match[1].split(",").map((part) => part.trim());
  if (parts.length < 3) {
    return color;
  }

  return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
}

function cssToken(name: string, fallback: string): string {
  if (typeof document === "undefined") {
    return fallback;
  }

  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return resolveColor(value, { fallback });
}

function shouldKeepColorKey(parentKey: string | null): boolean {
  // Strict mode: scrub all explicit example colors and rebuild from shadcn tokens.
  void parentKey;
  return false;
}

function scrubVisualDefaults(node: unknown, parentKey: string | null = null): unknown {
  if (Array.isArray(node)) {
    return node.map((item) => scrubVisualDefaults(item, parentKey));
  }

  if (!isRecord(node)) {
    return node;
  }

  const out: UnknownRecord = {};

  for (const [key, value] of Object.entries(node)) {
    if (key === "shadowBlur" || key === "shadowOffsetX" || key === "shadowOffsetY") {
      continue;
    }

    if (
      (key === "color" ||
        key === "color0" ||
        key === "borderColor" ||
        key === "borderColor0" ||
        key === "textBorderColor" ||
        key === "textShadowColor" ||
        key === "shadowColor") &&
      !shouldKeepColorKey(parentKey)
    ) {
      continue;
    }

    // Keep tooltip/card surfaces transparent so shadcn HTML tooltip can take over.
    if (key === "backgroundColor" && parentKey !== "tooltip") {
      continue;
    }

    out[key] = scrubVisualDefaults(value, key);
  }

  return out;
}

function polishAxis(axisValue: unknown, muted: string, border: string, showSplitLine: boolean): unknown {
  const axisList = toArray(axisValue);
  const next = axisList.map((axis) =>
    mergeDefined(axis, {
      axisLine: mergeDefined(isRecord(axis) ? axis.axisLine : undefined, {
        show: false,
      }),
      axisTick: mergeDefined(isRecord(axis) ? axis.axisTick : undefined, {
        show: false,
      }),
      axisLabel: mergeDefined(isRecord(axis) ? axis.axisLabel : undefined, {
        color: muted,
        margin: 10,
        fontSize: 11,
        hideOverlap:
          isRecord(axis) && isRecord(axis.axisLabel) && axis.axisLabel.hideOverlap !== undefined
            ? undefined
            : true,
      }),
      nameTextStyle: mergeDefined(isRecord(axis) ? axis.nameTextStyle : undefined, {
        color: muted,
        fontSize: 11,
      }),
      splitLine: mergeDefined(isRecord(axis) ? axis.splitLine : undefined, {
        show: showSplitLine,
        lineStyle: mergeDefined(
          isRecord(axis) && isRecord(axis.splitLine) ? axis.splitLine.lineStyle : undefined,
          {
            color: border,
            width: 1,
          },
        ),
      }),
    }),
  );

  return fromArray(axisValue as UnknownRecord | UnknownRecord[] | undefined, next);
}

function polishGrid(gridValue: unknown): unknown {
  const gridList = toArray(gridValue);
  const next = gridList.map((grid) =>
    mergeDefaults(grid, {
      containLabel: true,
      left: "6%",
      right: "6%",
      top: 28,
      bottom: 28,
    }),
  );

  return fromArray(gridValue as UnknownRecord | UnknownRecord[] | undefined, next);
}

function polishPolar(polarValue: unknown): unknown {
  const polarList = toArray(polarValue);
  const next = polarList.map((polar) =>
    mergeDefaults(polar, {
      radius: "66%",
      center: ["50%", "59%"],
    }),
  );

  return fromArray(polarValue as UnknownRecord | UnknownRecord[] | undefined, next);
}

function polishSeries(seriesValue: unknown, palette: string[], card: string): unknown {
  const seriesList = toArray(seriesValue);

  const next = seriesList.map((series, index) => {
    if (!isRecord(series)) {
      return series;
    }

    const type = typeof series.type === "string" ? series.type : "";
    const color = palette[index % palette.length] ?? palette[0];
    const colorSoft = withAlpha(color, 0.18);

    const base: UnknownRecord = {
      ...series,
      itemStyle: mergeDefined(series.itemStyle, {}),
      lineStyle: mergeDefined(series.lineStyle, {}),
      areaStyle: mergeDefined(series.areaStyle, {}),
      label: mergeDefined(series.label, {}),
    };

    if (type === "bar") {
      base.itemStyle = mergeDefined(base.itemStyle, {
        color,
        borderColor: card,
        borderWidth: 1,
        borderRadius: 8,
      });
      base.barMaxWidth = typeof series.barMaxWidth === "number" ? series.barMaxWidth : 42;
    } else if (type === "line") {
      base.lineStyle = mergeDefined(base.lineStyle, {
        color,
        width: 2,
      });
      base.itemStyle = mergeDefined(base.itemStyle, {
        color,
        borderColor: card,
        borderWidth: 1,
      });
      if (isRecord(series.areaStyle)) {
        base.areaStyle = mergeDefined(base.areaStyle, {
          color: colorSoft,
        });
      }
      if (series.showSymbol === undefined) {
        base.showSymbol = false;
      }
    } else if (type === "scatter" || type === "effectScatter") {
      base.itemStyle = mergeDefined(base.itemStyle, {
        color,
        borderColor: card,
        borderWidth: 1,
      });
    } else if (type === "pie" || type === "sunburst" || type === "treemap" || type === "funnel") {
      base.itemStyle = mergeDefined(base.itemStyle, {
        borderColor: card,
        borderWidth: 2,
      });
    } else if (type === "radar") {
      base.lineStyle = mergeDefined(base.lineStyle, {
        color,
        width: 2,
      });
      base.areaStyle = mergeDefined(base.areaStyle, {
        color: colorSoft,
      });
    } else if (type === "candlestick") {
      const up = palette[2] ?? color;
      const down = palette[4] ?? color;
      base.itemStyle = mergeDefined(base.itemStyle, {
        color: up,
        color0: down,
        borderColor: card,
        borderColor0: card,
      });
    } else if (type === "sankey") {
      base.lineStyle = mergeDefined(base.lineStyle, {
        color: withAlpha(color, 0.35),
      });
    } else if (type === "graph" || type === "lines") {
      base.lineStyle = mergeDefined(base.lineStyle, {
        color: withAlpha(color, 0.5),
      });
      base.itemStyle = mergeDefined(base.itemStyle, {
        color,
      });
    } else if (type === "map") {
      base.itemStyle = mergeDefined(base.itemStyle, {
        areaColor: withAlpha(color, 0.18),
        borderColor: withAlpha(card, 0.75),
        borderWidth: 1,
      });
    }

    return base;
  });

  return fromArray(seriesValue as UnknownRecord | UnknownRecord[] | undefined, next);
}

export function applyDemoStylePolish(option: EChartsCoreOption): EChartsCoreOption {
  const mode = getThemeMode();
  const palette = [
    cssToken("--chart-1", "rgb(99, 102, 241)"),
    cssToken("--chart-2", "rgb(14, 165, 233)"),
    cssToken("--chart-3", "rgb(16, 185, 129)"),
    cssToken("--chart-4", "rgb(234, 179, 8)"),
    cssToken("--chart-5", "rgb(244, 63, 94)"),
  ];
  const foreground = cssToken("--foreground", mode === "dark" ? "rgb(241, 245, 249)" : "rgb(15, 23, 42)");
  const muted = cssToken("--muted-foreground", mode === "dark" ? "rgb(148, 163, 184)" : "rgb(71, 85, 105)");
  const border = cssToken("--border", mode === "dark" ? "rgba(148, 163, 184, 0.20)" : "rgba(100, 116, 139, 0.18)");
  const card = cssToken("--card", mode === "dark" ? "rgb(2, 6, 23)" : "rgb(255, 255, 255)");
  const fontFamily =
    typeof document !== "undefined" && document.body ? getComputedStyle(document.body).fontFamily : undefined;

  const scrubbed = scrubVisualDefaults(deepClone(option)) as EChartsCoreOption;
  const minimal = applyMinimalPreset(scrubbed, { mode }) as UnknownRecord;

  minimal.backgroundColor = "transparent";
  minimal.color = palette;
  minimal.textStyle = mergeDefined(minimal.textStyle, {
    color: foreground,
    fontFamily,
    fontSize: 12,
  });
  minimal.grid = polishGrid(minimal.grid);
  minimal.polar = polishPolar(minimal.polar);
  minimal.xAxis = polishAxis(minimal.xAxis, muted, border, false);
  minimal.yAxis = polishAxis(minimal.yAxis, muted, border, true);
  minimal.angleAxis = polishAxis(minimal.angleAxis, muted, border, false);
  minimal.radiusAxis = polishAxis(minimal.radiusAxis, muted, border, true);
  minimal.series = polishSeries(minimal.series, palette, card);
  minimal.legend = fromArray(
    minimal.legend as UnknownRecord | UnknownRecord[] | undefined,
    toArray(minimal.legend as UnknownRecord | UnknownRecord[] | undefined).map((legend) =>
      mergeDefined(legend, {
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 10,
        textStyle: mergeDefined(isRecord(legend) ? legend.textStyle : undefined, {
          color: muted,
          fontSize: 11,
        }),
      }),
    ),
  );
  minimal.title = fromArray(
    minimal.title as UnknownRecord | UnknownRecord[] | undefined,
    toArray(minimal.title as UnknownRecord | UnknownRecord[] | undefined).map((title) =>
      mergeDefined(title, {
        textStyle: mergeDefined(isRecord(title) ? title.textStyle : undefined, {
          color: foreground,
          fontWeight: 600,
        }),
        subtextStyle: mergeDefined(isRecord(title) ? title.subtextStyle : undefined, {
          color: muted,
        }),
      }),
    ),
  );
  minimal.tooltip = mergeDefined(minimal.tooltip, {
    renderMode: "html",
    appendToBody: true,
    confine: true,
  });
  minimal.visualMap = fromArray(
    minimal.visualMap as UnknownRecord | UnknownRecord[] | undefined,
    toArray(minimal.visualMap as UnknownRecord | UnknownRecord[] | undefined).map((vm) => {
      const pieces = Array.isArray(vm.pieces)
        ? vm.pieces.map((piece, index) =>
            isRecord(piece)
              ? mergeDefined(piece, { color: palette[index % palette.length] })
              : piece,
          )
        : vm.pieces;

      return mergeDefined(vm, {
        textStyle: mergeDefined(isRecord(vm) ? vm.textStyle : undefined, {
          color: muted,
        }),
        inRange: mergeDefined(isRecord(vm) ? vm.inRange : undefined, {
          color: palette,
        }),
        outOfRange: mergeDefined(isRecord(vm) ? vm.outOfRange : undefined, {
          color: [withAlpha(muted, 0.3)],
        }),
        pieces,
      });
    }),
  );

  return minimal as EChartsCoreOption;
}
