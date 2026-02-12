import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CATEGORIES, EXAMPLE_COUNTS, getCategoryLabel } from "@/lib/examples";

export function OverviewPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card">
          <CardHeader>
            <CardDescription>Total Examples</CardDescription>
            <CardTitle className="text-3xl">{EXAMPLE_COUNTS.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader>
            <CardDescription>Supported</CardDescription>
            <CardTitle className="text-3xl text-emerald-600 dark:text-emerald-400">
              {EXAMPLE_COUNTS.supported}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader>
            <CardDescription>Not Yet Replicated</CardDescription>
            <CardTitle className="text-3xl text-amber-600 dark:text-amber-400">
              {EXAMPLE_COUNTS.unsupported}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Coverage by Category</CardTitle>
          <CardDescription>
            Every ECharts example in the corpus is tracked and linked to an implementation status.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => {
            const metrics = EXAMPLE_COUNTS.byCategory[category];
            return (
              <Link key={category} to={`/category/${category}`} className="block">
                <div className="rounded-lg border bg-background/30 p-4 transition hover:bg-accent/30">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium">{getCategoryLabel(category)}</h3>
                    <Badge variant="secondary">{metrics.total}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {metrics.supported} supported · {metrics.unsupported} unsupported
                  </p>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/examples">Browse all examples</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/unsupported">View unsupported examples</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/diagnostics">Run diagnostics</Link>
        </Button>
      </div>
    </div>
  );
}
