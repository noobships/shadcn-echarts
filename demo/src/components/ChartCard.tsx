import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorBoundary } from "./ErrorBoundary";
import type { ReactNode } from "react";

interface ChartCardProps {
  id: string;
  title: string;
  description: string;
  minHeight?: string;
  children: ReactNode;
}

export function ChartCard({
  id,
  title,
  description,
  minHeight = "30rem",
  children,
}: ChartCardProps) {
  return (
    <Card className="h-full bg-card" data-chart-card={id}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ErrorBoundary>
          <div style={{ minHeight }} className="w-full overflow-visible rounded-md">
            {children}
          </div>
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
}
