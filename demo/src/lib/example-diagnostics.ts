import * as echarts from "echarts/core";
import type { EChartsCoreOption } from "echarts/core";
import type { ExampleCatalogEntry } from "@/types/examples";
import { evaluateExampleOption, executeExampleRuntime } from "@/lib/example-evaluator";
import { applyDemoStylePolish } from "@/lib/demo-style-polish";
import { getPreferredHeight, getPreferredRenderer } from "@/lib/chart-registry";
import "@/lib/chart-registry";

export type DiagnosticStage = "evaluate" | "style" | "render" | "runtime";

export interface ExampleDiagnosticResult {
  id: string;
  title: string;
  category: string;
  status: "pass" | "fail";
  stage: DiagnosticStage;
  durationMs: number;
  checkedAt: string;
  warnings: string[];
  errorMessage?: string;
}

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

function waitNextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

async function probeRenderedOption(
  entry: ExampleCatalogEntry,
  option: EChartsCoreOption,
  signal?: AbortSignal,
): Promise<void> {
  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  const renderer = getPreferredRenderer(entry.id, entry.category);
  const preferredHeight = getPreferredHeight(entry.category);
  const height = parseCssLengthPx(preferredHeight, 480);
  const width = 1080;

  const container = document.createElement("div");
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "-10000px";
  container.style.opacity = "0";
  container.style.pointerEvents = "none";
  document.body.appendChild(container);

  const capturedErrors: string[] = [];
  const onWindowError = (event: ErrorEvent) => {
    const message = event.error instanceof Error ? event.error.message : event.message;
    if (message) {
      capturedErrors.push(String(message));
    }
  };
  const onRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    if (reason instanceof Error) {
      capturedErrors.push(reason.message);
      return;
    }
    capturedErrors.push(String(reason));
  };

  window.addEventListener("error", onWindowError);
  window.addEventListener("unhandledrejection", onRejection);

  let chart: echarts.EChartsType | null = null;
  try {
    chart = echarts.init(container, undefined, {
      renderer,
      width,
      height,
    });
    chart.setOption(option, {
      notMerge: true,
      lazyUpdate: false,
    });

    await waitNextFrame();
    await waitNextFrame();

    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    if (capturedErrors.length > 0) {
      throw new Error(capturedErrors[0]);
    }

    // Trigger a read operation to force late chart computations.
    chart.getDataURL({
      type: "png",
      pixelRatio: 1,
      backgroundColor: "transparent",
    });
  } finally {
    window.removeEventListener("error", onWindowError);
    window.removeEventListener("unhandledrejection", onRejection);
    if (chart && !chart.isDisposed()) {
      try {
        chart.dispose();
      } catch {
        // Ignore teardown-only disposal errors from certain large datazoom examples.
      }
    }
    container.remove();
  }
}

async function probeImperativeRuntime(
  entry: ExampleCatalogEntry,
  signal?: AbortSignal,
): Promise<string[]> {
  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  const renderer = getPreferredRenderer(entry.id, entry.category);
  const preferredHeight = getPreferredHeight(entry.category);
  const height = parseCssLengthPx(preferredHeight, 480);
  const width = 1080;

  const container = document.createElement("div");
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "-10000px";
  container.style.opacity = "0";
  container.style.pointerEvents = "none";
  document.body.appendChild(container);

  const capturedErrors: string[] = [];
  const onWindowError = (event: ErrorEvent) => {
    const message = event.error instanceof Error ? event.error.message : event.message;
    if (message) {
      capturedErrors.push(String(message));
    }
  };
  const onRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    if (reason instanceof Error) {
      capturedErrors.push(reason.message);
      return;
    }
    capturedErrors.push(String(reason));
  };

  window.addEventListener("error", onWindowError);
  window.addEventListener("unhandledrejection", onRejection);

  let chart: echarts.EChartsType | null = null;
  let runtimeDispose: (() => void) | null = null;
  let setOptionCount = 0;
  let runtimeWarnings: string[] = [];
  try {
    chart = echarts.init(container, undefined, {
      renderer,
      width,
      height,
    });

    const runtimeResult = await executeExampleRuntime(entry, {
      chart,
      container,
      size: {
        width,
        height,
      },
      signal,
      onSetOption: () => {
        setOptionCount += 1;
      },
    });
    runtimeDispose = runtimeResult.dispose;
    runtimeWarnings = runtimeResult.warnings;

    await waitNextFrame();
    await waitNextFrame();

    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    if (capturedErrors.length > 0) {
      throw new Error(capturedErrors[0]);
    }

    if (setOptionCount < 1) {
      throw new Error("Runtime execution did not call setOption.");
    }

    chart.getDataURL({
      type: "png",
      pixelRatio: 1,
      backgroundColor: "transparent",
    });

    return runtimeWarnings;
  } finally {
    window.removeEventListener("error", onWindowError);
    window.removeEventListener("unhandledrejection", onRejection);
    runtimeDispose?.();
    if (chart && !chart.isDisposed()) {
      try {
        chart.dispose();
      } catch {
        // Ignore teardown-only disposal errors from certain large datazoom examples.
      }
    }
    container.remove();
  }
}

export async function runDiagnosticForEntry(
  entry: ExampleCatalogEntry,
  signal?: AbortSignal,
): Promise<ExampleDiagnosticResult> {
  const startedAt = performance.now();
  let stage: DiagnosticStage = "evaluate";
  let warnings: string[] = [];

  try {
    if (entry.executionMode === "imperative-runtime") {
      stage = "runtime";
      warnings = await probeImperativeRuntime(entry, signal);
    } else {
      const preferredHeight = getPreferredHeight(entry.category);
      const staticHeight = parseCssLengthPx(preferredHeight, 480);
      const evaluated = await evaluateExampleOption(entry, {
        size: {
          width: 1080,
          height: staticHeight,
        },
      });
      warnings = evaluated.warnings;

      if (signal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }

      stage = "style";
      const polished = applyDemoStylePolish(evaluated.option);

      if (signal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }

      stage = "render";
      await probeRenderedOption(entry, polished, signal);
    }

    return {
      id: entry.id,
      title: entry.title,
      category: entry.category,
      status: "pass",
      stage,
      durationMs: Math.round(performance.now() - startedAt),
      checkedAt: new Date().toISOString(),
      warnings,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    const message =
      error instanceof Error
        ? `[diag:${entry.id}] ${error.message || "Unknown diagnostic error"}${
            error.stack ? ` :: ${error.stack}` : ""
          }`
        : String(error || "Unknown diagnostic error");
    return {
      id: entry.id,
      title: entry.title,
      category: entry.category,
      status: "fail",
      stage,
      durationMs: Math.round(performance.now() - startedAt),
      checkedAt: new Date().toISOString(),
      warnings,
      errorMessage: message,
    };
  }
}
