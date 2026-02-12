import { ChartCard } from "./ChartCard";
import {
  chartExamples,
  chartGroupLabels,
  type ChartGroup,
} from "../examples/chartExamples";
import { chartComponents } from "../examples/chartComponents";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const groupOrder: ChartGroup[] = [
  "line-area",
  "bar",
  "pie",
  "scatter",
  "radar-gauge",
  "statistical",
  "hierarchical",
  "flow",
  "custom",
];

export function ChartGallery() {
  const chartsByGroup = groupOrder.map((group) => ({
    group,
    label: chartGroupLabels[group],
    charts: chartExamples.filter((c) => c.group === group),
  }));

  return (
    <Tabs defaultValue="line-area" className="w-full">
      <TabsList className="mb-6 flex-wrap h-auto gap-1">
        {chartsByGroup.map(({ group, label, charts }) => (
          <TabsTrigger key={group} value={group}>
            {label}
            <span className="ml-1.5 text-xs text-muted-foreground">
              {charts.length}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {chartsByGroup.map(({ group, charts }) => (
        <TabsContent key={group} value={group}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {charts.map((example) => {
              const Component = chartComponents[example.name];
              if (!Component) return null;

              return (
                <ChartCard
                  key={example.name}
                  id={example.name}
                  title={example.title}
                  description={example.description}
                >
                  <Component option={example.option} />
                </ChartCard>
              );
            })}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
