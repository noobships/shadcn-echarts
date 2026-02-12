import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangleIcon,
  CheckIcon,
  CopyIcon,
  Loader2Icon,
  PlayIcon,
  RotateCcwIcon,
  SquareIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ALL_EXAMPLES, CATEGORIES, getCategoryLabel, toExampleRoute } from "@/lib/examples";
import { runDiagnosticForEntry, type ExampleDiagnosticResult } from "@/lib/example-diagnostics";
import type { ExampleCatalogEntry } from "@/types/examples";

type DiagnosticsMode = "all" | "failed";

function useSupportedEntries(): ExampleCatalogEntry[] {
  return useMemo(
    () => ALL_EXAMPLES.filter((entry) => entry.status === "supported" && entry.chartComponent !== null),
    [],
  );
}

function formatFailureReport(params: {
  failures: ExampleDiagnosticResult[];
  mode: DiagnosticsMode;
  categoryFilter: string;
  runTargetCount: number;
  completedCount: number;
}): string {
  const generatedAt = new Date().toISOString();
  const scopeCategory =
    params.categoryFilter === "all" ? "all categories" : getCategoryLabel(params.categoryFilter);

  const lines: string[] = [
    "# shadcn-echarts diagnostics failure report",
    "",
    `Generated at: ${generatedAt}`,
    `Mode: ${params.mode === "all" ? "all supported" : "failed only"}`,
    `Category scope: ${scopeCategory}`,
    `Run target count: ${params.runTargetCount}`,
    `Run completed count: ${params.completedCount}`,
    `Failure count: ${params.failures.length}`,
    "",
  ];

  if (params.failures.length === 0) {
    lines.push("No failures in this diagnostics scope.");
    return lines.join("\n");
  }

  params.failures.forEach((result, index) => {
    lines.push(`## ${index + 1}. ${result.id}`);
    lines.push(`title: ${result.title}`);
    lines.push(`category: ${result.category}`);
    lines.push(`stage: ${result.stage}`);
    lines.push(`durationMs: ${result.durationMs}`);
    lines.push(`checkedAt: ${result.checkedAt}`);
    lines.push(`error: ${result.errorMessage ?? "Unknown error"}`);
    if (result.warnings.length > 0) {
      lines.push("warnings:");
      result.warnings.forEach((warning) => {
        lines.push(`- ${warning}`);
      });
    }
    lines.push("");
  });

  return lines.join("\n");
}

export function DiagnosticsPage() {
  const supportedEntries = useSupportedEntries();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [resultsById, setResultsById] = useState<Record<string, ExampleDiagnosticResult>>({});
  const [running, setRunning] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [currentRunIds, setCurrentRunIds] = useState<string[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [lastMode, setLastMode] = useState<DiagnosticsMode>("all");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [copyFallbackText, setCopyFallbackText] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const filteredEntries = useMemo(
    () =>
      supportedEntries.filter((entry) =>
        categoryFilter === "all" ? true : entry.category === categoryFilter,
      ),
    [categoryFilter, supportedEntries],
  );

  const failedInFilter = useMemo(
    () =>
      filteredEntries.filter((entry) => {
        const result = resultsById[entry.id];
        return result?.status === "fail";
      }),
    [filteredEntries, resultsById],
  );

  const currentRunResults = useMemo(
    () => currentRunIds.map((id) => resultsById[id]).filter(Boolean),
    [currentRunIds, resultsById],
  );

  const runPassCount = currentRunResults.filter((result) => result.status === "pass").length;
  const runFailCount = currentRunResults.filter((result) => result.status === "fail").length;
  const runPendingCount = Math.max(currentRunIds.length - currentRunResults.length, 0);
  const progressPct = currentRunIds.length > 0 ? Math.round((completedCount / currentRunIds.length) * 100) : 0;

  const allFailures = useMemo(
    () =>
      Object.values(resultsById)
        .filter((result) => result.status === "fail")
        .sort((a, b) => b.checkedAt.localeCompare(a.checkedAt)),
    [resultsById],
  );

  const latestRunFailures = useMemo(
    () =>
      currentRunIds
        .map((id) => resultsById[id])
        .filter((result): result is ExampleDiagnosticResult => Boolean(result))
        .filter((result) => result.status === "fail"),
    [currentRunIds, resultsById],
  );

  async function startDiagnostics(mode: DiagnosticsMode) {
    if (running) {
      return;
    }

    const queue =
      mode === "failed"
        ? failedInFilter
        : filteredEntries;

    setLastMode(mode);
    setCopyState("idle");
    setCopyFallbackText("");
    setCurrentRunIds(queue.map((entry) => entry.id));
    setCompletedCount(0);
    setStartedAt(Date.now());

    if (queue.length === 0) {
      setRunning(false);
      setActiveId(null);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setRunning(true);

    for (let index = 0; index < queue.length; index += 1) {
      if (controller.signal.aborted) {
        break;
      }

      const entry = queue[index];
      setActiveId(entry.id);

      try {
        const result = await runDiagnosticForEntry(entry, controller.signal);
        setResultsById((prev) => ({
          ...prev,
          [entry.id]: result,
        }));
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setResultsById((prev) => ({
            ...prev,
            [entry.id]: {
              id: entry.id,
              title: entry.title,
              category: entry.category,
              status: "fail",
              stage: "render",
              durationMs: 0,
              checkedAt: new Date().toISOString(),
              warnings: [],
              errorMessage: error instanceof Error ? error.message : String(error),
            },
          }));
        }
      }

      setCompletedCount(index + 1);

      // Yield to the browser so the UI remains responsive.
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 0);
      });
    }

    setActiveId(null);
    setRunning(false);
    abortRef.current = null;
  }

  function stopDiagnostics() {
    abortRef.current?.abort();
    setRunning(false);
    setActiveId(null);
  }

  async function copyFailureReport() {
    const sourceFailures = latestRunFailures.length > 0 ? latestRunFailures : allFailures;
    const report = formatFailureReport({
      failures: sourceFailures,
      mode: lastMode,
      categoryFilter,
      runTargetCount: currentRunIds.length,
      completedCount,
    });

    try {
      await navigator.clipboard.writeText(report);
      setCopyState("copied");
      setCopyFallbackText("");
    } catch {
      setCopyState("failed");
      setCopyFallbackText(report);
    }
  }

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return (
    <div className="space-y-4">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Runtime Diagnostics</CardTitle>
          <CardDescription>
            Batch-checks supported examples through evaluate → style polish → headless render probe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="h-9 rounded-md border bg-background px-3 text-sm"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              disabled={running}
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {getCategoryLabel(category)}
                </option>
              ))}
            </select>

            <Button onClick={() => void startDiagnostics("all")} disabled={running || filteredEntries.length === 0}>
              <PlayIcon className="size-4 mr-1" />
              Run Diagnostics
            </Button>
            <Button
              variant="outline"
              onClick={() => void startDiagnostics("failed")}
              disabled={running || failedInFilter.length === 0}
            >
              <RotateCcwIcon className="size-4 mr-1" />
              Re-run Failed
            </Button>
            <Button variant="destructive" onClick={stopDiagnostics} disabled={!running}>
              <SquareIcon className="size-4 mr-1" />
              Stop
            </Button>
            <Button
              variant="outline"
              onClick={() => void copyFailureReport()}
              disabled={running || (latestRunFailures.length === 0 && allFailures.length === 0)}
            >
              {copyState === "copied" ? <CheckIcon className="size-4 mr-1" /> : <CopyIcon className="size-4 mr-1" />}
              Copy Errors
            </Button>
          </div>

          {copyState === "copied" ? (
            <div className="text-xs text-emerald-600 dark:text-emerald-400">
              Copied failure report to clipboard.
            </div>
          ) : null}
          {copyState === "failed" ? (
            <div className="space-y-2">
              <div className="text-xs text-amber-600 dark:text-amber-400">
                Clipboard permission failed. Copy manually from the box below.
              </div>
              <textarea
                readOnly
                value={copyFallbackText}
                className="w-full h-44 rounded-md border bg-background p-2 text-xs font-mono"
              />
            </div>
          ) : null}

          {currentRunIds.length > 0 ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>
                  Mode: <strong>{lastMode === "all" ? "all supported" : "failed only"}</strong>
                </span>
                <span>Target: {currentRunIds.length}</span>
                <span>Completed: {completedCount}</span>
                <span>Pass: {runPassCount}</span>
                <span>Fail: {runFailCount}</span>
                {startedAt ? <span>Started: {new Date(startedAt).toLocaleTimeString()}</span> : null}
              </div>

              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.max(0, Math.min(100, progressPct))}%` }}
                />
              </div>

              {running ? (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Loader2Icon className="size-3.5 animate-spin" />
                  Running… {activeId ?? "preparing"} ({progressPct}%)
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  Run complete. Pending in this run: {runPendingCount}
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              Select scope and run diagnostics to populate results.
            </div>
          )}
        </CardContent>
      </Card>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Supported in Scope</CardDescription>
            <CardTitle className="text-2xl">{filteredEntries.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Known Failing</CardDescription>
            <CardTitle className="text-2xl text-destructive">{failedInFilter.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Total Checked</CardDescription>
            <CardTitle className="text-2xl">{Object.keys(resultsById).length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Total Failures</CardDescription>
            <CardTitle className="text-2xl text-amber-600 dark:text-amber-400">
              {allFailures.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Failure Report</CardTitle>
          <CardDescription>
            Latest failures across runs with stage information and direct links.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {allFailures.length === 0 ? (
            <div className="text-sm text-muted-foreground">No failing examples captured yet.</div>
          ) : (
            allFailures.slice(0, 200).map((result) => (
              <div key={`${result.id}-${result.checkedAt}`} className="rounded-md border p-3 bg-background/30 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="destructive">failed</Badge>
                  <Badge variant="secondary">{result.stage}</Badge>
                  <Badge variant="outline">{getCategoryLabel(result.category)}</Badge>
                  <span className="text-xs text-muted-foreground">{result.durationMs} ms</span>
                </div>
                <div className="font-medium text-sm">{result.title}</div>
                <div className="text-xs text-muted-foreground">{result.id}</div>
                <div className="text-xs text-destructive flex items-start gap-1">
                  <AlertTriangleIcon className="size-3.5 mt-0.5 shrink-0" />
                  <span className="wrap-break-word">{result.errorMessage ?? "Unknown error"}</span>
                </div>
                <div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={toExampleRoute(result.id)}>Open Example</Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
