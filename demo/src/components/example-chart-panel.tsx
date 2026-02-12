import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangleIcon, CircleCheckIcon, Loader2Icon } from "lucide-react";
import type { EChartsCoreOption } from "echarts/core";
import { useTheme } from "next-themes";
import { Chart, type ChartRef } from "@devstool/shadcn-echarts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
  renderChartByKey,
  getAdaptiveHeight,
  getPreferredHeight,
  getPreferredRenderer,
} from "@/lib/chart-registry";
import { evaluateExampleOption, executeExampleRuntime } from "@/lib/example-evaluator";
import { applyDemoStylePolish } from "@/lib/demo-style-polish";
import type { ExampleCatalogEntry } from "@/types/examples";

type ExampleChartPanelProps = {
  entry: ExampleCatalogEntry;
};

function parseCssLengthPx(value: string, fallback: number): number {
  const numeric = Number.parseFloat(value.replace("rem", ""));
  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  if (value.includes("rem")) {
    return Math.max(280, Math.round(numeric * 16));
  }

  if (value.includes("px")) {
    return Math.max(280, Math.round(numeric));
  }

  return fallback;
}

export function ExampleChartPanel({ entry }: ExampleChartPanelProps) {
  const { resolvedTheme } = useTheme();
  const chartRef = useRef<ChartRef | null>(null);
  const chartHostRef = useRef<HTMLDivElement | null>(null);
  const [panelWidth, setPanelWidth] = useState<number>(1080);
  const [option, setOption] = useState<EChartsCoreOption | null>(null);
  const [loading, setLoading] = useState<boolean>(entry.status === "supported");
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [runtimeSetOptionCount, setRuntimeSetOptionCount] = useState<number>(0);

  const baseHeight = useMemo(() => getPreferredHeight(entry.category), [entry.category]);
  const [staticHeight, setStaticHeight] = useState<string>(baseHeight);
  const staticHeightPx = useMemo(() => parseCssLengthPx(staticHeight, 480), [staticHeight]);
  const runtimeHeight = baseHeight;
  const runtimeHeightPx = useMemo(() => parseCssLengthPx(runtimeHeight, 480), [runtimeHeight]);
  const runtimeShellOption = useMemo<EChartsCoreOption>(() => ({}), []);
  const executionMode = entry.executionMode;
  const isImperativeRuntime = executionMode === "imperative-runtime";
  const renderer = useMemo(
    () => getPreferredRenderer(entry.id, entry.category),
    [entry.category, entry.id],
  );

  useEffect(() => {
    setStaticHeight(baseHeight);
  }, [baseHeight, entry.id]);

  useEffect(() => {
    const element = chartHostRef.current;
    if (!element) {
      return;
    }

    const update = () => {
      const width = element.clientWidth;
      setPanelWidth(width > 0 ? Math.round(width) : 1080);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [entry.id]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (entry.status !== "supported" || !entry.chartComponent) {
        setLoading(false);
        setOption(null);
        setWarnings([]);
        return;
      }

      if (isImperativeRuntime) {
        setLoading(true);
        setOption(null);
        setRuntimeError(null);
        setWarnings([]);
        setRuntimeSetOptionCount(0);
        return;
      }

      setLoading(true);
      setRuntimeError(null);
      setWarnings([]);

      try {
        const result = await evaluateExampleOption(entry, {
          size: {
            width: Math.max(360, panelWidth),
            height: staticHeightPx,
          },
        });
        if (!cancelled) {
          setStaticHeight(getAdaptiveHeight(entry.category, result.option));
          setOption(applyDemoStylePolish(result.option));
          setWarnings(result.warnings);
          setRuntimeSetOptionCount(0);
        }
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "Unknown rendering error";
          setRuntimeError(message);
          setOption(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [entry, isImperativeRuntime, panelWidth, resolvedTheme, staticHeightPx]);

  useEffect(() => {
    let cancelled = false;
    let runtimeDispose: (() => void) | null = null;
    const abortController = new AbortController();

    async function runRuntimeMode() {
      if (entry.status !== "supported" || !entry.chartComponent || !isImperativeRuntime) {
        return;
      }

      setLoading(true);
      setRuntimeError(null);
      setWarnings([]);
      setOption(null);
      setRuntimeSetOptionCount(0);

      try {
        let runtimeChart = chartRef.current?.getEchartsInstance() ?? null;
        for (let attempt = 0; !runtimeChart && attempt < 30; attempt += 1) {
          if (cancelled || abortController.signal.aborted) {
            return;
          }
          await new Promise<void>((resolve) => {
            setTimeout(() => resolve(), 40);
          });
          runtimeChart = chartRef.current?.getEchartsInstance() ?? null;
        }

        if (!runtimeChart || runtimeChart.isDisposed()) {
          throw new Error("Unable to initialize runtime chart instance.");
        }

        // React StrictMode mounts effects twice in dev. Delay runtime bootstrap so the
        // throwaway mount can cancel before we wire script timers/listeners.
        await new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 80);
        });
        if (cancelled || abortController.signal.aborted) {
          return;
        }
        runtimeChart = chartRef.current?.getEchartsInstance() ?? runtimeChart;
        if (!runtimeChart || runtimeChart.isDisposed()) {
          throw new Error("Runtime chart instance was disposed during bootstrap.");
        }

        const container = runtimeChart.getDom();
        if (!(container instanceof HTMLElement)) {
          throw new Error("Runtime chart container is unavailable.");
        }

        const result = await executeExampleRuntime(entry, {
          chart: runtimeChart,
          container,
          size: {
            width: Math.max(360, panelWidth),
            height: runtimeHeightPx,
          },
          signal: abortController.signal,
          onSetOption: () => {
            if (!cancelled) {
              setRuntimeSetOptionCount((prev) => prev + 1);
            }
          },
        });

        if (cancelled) {
          result.dispose();
          return;
        }

        runtimeDispose = result.dispose;
        setWarnings(result.warnings);
      } catch (error) {
        if (cancelled || (error instanceof DOMException && error.name === "AbortError")) {
          return;
        }

        const message = error instanceof Error ? error.message : "Unknown runtime rendering error";
        setRuntimeError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void runRuntimeMode();

    return () => {
      cancelled = true;
      abortController.abort();
      runtimeDispose?.();
    };
  }, [entry, isImperativeRuntime, panelWidth, resolvedTheme, runtimeHeightPx]);

  if (entry.status !== "supported" || !entry.chartComponent) {
    return (
      <Card className="border-dashed bg-card/80" data-example-chart-panel={entry.id}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangleIcon className="size-4 text-amber-500" />
            Not Replicated Yet
          </CardTitle>
          <CardDescription>
            This example is tracked but currently unsupported in the demo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Badge variant="secondary">{entry.unsupportedReason ?? "unsupported"}</Badge>
          {entry.missingAssetUrls.length > 0 ? (
            <p className="text-xs text-muted-foreground">
              Missing local assets: {entry.missingAssetUrls.length}
            </p>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="bg-card border-border shadow-sm"
      data-example-chart-panel={entry.id}
      data-execution-mode={executionMode}
      data-runtime-setoption-count={
        isImperativeRuntime && entry.status === "supported" ? runtimeSetOptionCount : undefined
      }
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{entry.title}</CardTitle>
        <CardDescription className="text-xs">
          {entry.sourcePath} · renderer: {renderer} · mode: {executionMode}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isImperativeRuntime && loading ? (
          <div
            ref={chartHostRef}
            style={{ minHeight: staticHeight }}
            className="rounded-lg border bg-background/40 flex items-center justify-center text-muted-foreground overflow-hidden"
          >
            <Loader2Icon className="size-4 mr-2 animate-spin" />
            Evaluating example option...
          </div>
        ) : null}

        {isImperativeRuntime ? (
          <ErrorBoundary>
            <div
              ref={chartHostRef}
              style={{ minHeight: runtimeHeight }}
              className="relative w-full rounded-lg border bg-background/20 p-2 overflow-hidden"
            >
              <Chart
                ref={chartRef}
                option={runtimeShellOption}
                renderer={renderer}
                style={{ height: runtimeHeight, width: "100%" }}
                preset={false}
              />
              {loading ? (
                <div className="absolute inset-0 m-2 rounded-md bg-background/70 backdrop-blur-[1px] flex items-center justify-center text-muted-foreground">
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Executing interactive runtime...
                </div>
              ) : null}
            </div>
          </ErrorBoundary>
        ) : null}

        {!loading && runtimeError ? (
          <div
            style={{ minHeight: isImperativeRuntime ? runtimeHeight : staticHeight }}
            className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive"
          >
            <div className="font-medium mb-1">Unable to render this example right now.</div>
            <div className="text-xs text-destructive/90 wrap-break-word">{runtimeError}</div>
          </div>
        ) : null}

        {!isImperativeRuntime && !loading && !runtimeError && option ? (
          <ErrorBoundary>
            <div
              ref={chartHostRef}
              style={{ minHeight: staticHeight }}
              className="w-full rounded-lg border bg-background/20 p-2 overflow-hidden"
            >
              {renderChartByKey(entry.chartComponent, {
                option,
                renderer,
                height: staticHeight,
              })}
            </div>
          </ErrorBoundary>
        ) : null}

        {isImperativeRuntime && !loading && !runtimeError ? (
          <div className="text-xs text-muted-foreground">
            Runtime setOption calls captured: {runtimeSetOptionCount}
          </div>
        ) : null}

        {warnings.length > 0 ? (
          <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
            <div className="font-medium mb-1 flex items-center gap-1">
              <AlertTriangleIcon className="size-3.5" />
              Runtime warnings
            </div>
            <ul className="space-y-1">
              {warnings.map((warning) => (
                <li key={warning} className="wrap-break-word">
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        ) : !loading && !runtimeError && (isImperativeRuntime || option !== null) ? (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <CircleCheckIcon className="size-3.5 text-emerald-500" />
            {isImperativeRuntime ? (
              <>
                Rendered via <code>@devstool/shadcn-echarts</code> interactive runtime execution mode.
              </>
            ) : (
              <>
                Rendered via <code>@devstool/shadcn-echarts</code> with shadcn style polish.
              </>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
