import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORIES, EXAMPLE_COUNTS, filterExamples, getCategoryLabel, toExampleRoute } from "@/lib/examples";
import type { ExampleStatus } from "@/types/examples";

type ExamplesPageProps = {
  defaultStatus?: "all" | ExampleStatus;
};

export function ExamplesPage({ defaultStatus = "all" }: ExamplesPageProps) {
  const { category } = useParams<{ category?: string }>();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | ExampleStatus>(defaultStatus);
  const [categoryFilter, setCategoryFilter] = useState(category ?? "all");

  const effectiveCategory = category ?? (categoryFilter === "all" ? undefined : categoryFilter);

  const filtered = useMemo(
    () =>
      filterExamples({
        category: effectiveCategory,
        query,
        status,
      }),
    [effectiveCategory, query, status],
  );

  const pageTitle = category ? `${getCategoryLabel(category)} Examples` : "All Examples";
  const pageDescription = category
    ? `Replications and statuses for ${getCategoryLabel(category)}.`
    : "Browse the full ECharts corpus replication powered by @devstool/shadcn-echarts.";

  return (
    <div className="space-y-4">
      <Card className="bg-card">
        <CardHeader className="pb-3">
          <CardTitle>{pageTitle}</CardTitle>
          <CardDescription>{pageDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, id, or source path..."
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={status === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatus("all")}
            >
              All
            </Button>
            <Button
              variant={status === "supported" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatus("supported")}
            >
              Supported
            </Button>
            <Button
              variant={status === "unsupported" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatus("unsupported")}
            >
              Unsupported
            </Button>

            {!category ? (
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="h-8 rounded-md border bg-background px-2 text-xs"
              >
                <option value="all">All categories</option>
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {getCategoryLabel(item)}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground">
        Showing {filtered.length} example{filtered.length === 1 ? "" : "s"}.
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((entry) => (
          <Card key={entry.id} className="bg-card hover:border-primary/40 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm leading-5">{entry.title}</CardTitle>
                <Badge variant={entry.status === "supported" ? "default" : "secondary"}>
                  {entry.status}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                {getCategoryLabel(entry.category)} · {entry.extension.toUpperCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground break-all">{entry.sourcePath}</p>
              {entry.status === "unsupported" ? (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Reason: {entry.unsupportedReason ?? "unknown"}
                </p>
              ) : null}
              <Button asChild className="w-full" variant="outline" size="sm">
                <Link to={toExampleRoute(entry.id)}>Open example</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="bg-card border-dashed">
          <CardContent className="py-8 text-sm text-muted-foreground text-center">
            No examples match the current filters.
          </CardContent>
        </Card>
      ) : null}

      {!category ? (
        <Card className="bg-card">
          <CardContent className="py-4 text-xs text-muted-foreground">
            Coverage snapshot: {EXAMPLE_COUNTS.supported}/{EXAMPLE_COUNTS.total} currently flagged as
            supported.
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
