import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExampleChartPanel } from "@/components/example-chart-panel";
import { findExampleById, getCategoryLabel } from "@/lib/examples";

export function ExampleDetailPage() {
  const { encodedId } = useParams<{ encodedId: string }>();
  const id = encodedId ? decodeURIComponent(encodedId) : "";
  const entry = findExampleById(id);

  if (!entry) {
    return <Navigate to="/examples" replace />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to={entry.category ? `/category/${entry.category}` : "/examples"}>
            <ArrowLeftIcon className="size-4 mr-1" />
            Back
          </Link>
        </Button>
        <Badge variant="secondary">{getCategoryLabel(entry.category)}</Badge>
        <Badge variant={entry.status === "supported" ? "default" : "secondary"}>{entry.status}</Badge>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>{entry.title}</CardTitle>
          <CardDescription className="break-all">{entry.sourcePath}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <div>ID: {entry.id}</div>
          <div>Chart wrapper: {entry.chartComponent ?? "not mapped"}</div>
          <div>Required assets: {entry.requiredAssetUrls.length}</div>
          {entry.missingAssetUrls.length > 0 ? (
            <div className="text-amber-600 dark:text-amber-400">
              Missing assets: {entry.missingAssetUrls.length}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <ExampleChartPanel entry={entry} />
    </div>
  );
}
