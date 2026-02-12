import { PACKAGE_NAME } from "../../lib/site-config";

export default function ThemingPage() {
  return (
    <>
      <h1>Theming</h1>
      <p className="lead">
        shadcn-echarts reads your CSS variables and registers matching ECharts themes.
      </p>

      <h2>Default behavior</h2>
      <ul>
        <li>Theme auto-detects from `.dark` class and system preference.</li>
        <li>No `theme` prop required for most use cases.</li>
        <li>Minimal preset is defaults-only and does not override explicit styles.</li>
      </ul>

      <h2>Force theme mode</h2>
      <pre>
        <code>{`import { BarChart } from "${PACKAGE_NAME}"

<BarChart
  theme="dark"
  option={{
    xAxis: { type: "category", data: ["Mon", "Tue", "Wed"] },
    yAxis: { type: "value" },
    series: [{ type: "bar", data: [20, 40, 15] }]
  }}
/>`}</code>
      </pre>

      <h2>Important CSS tokens</h2>
      <ul>
        <li>
          Chart palette: <code>--chart-1</code> ... <code>--chart-5</code>
        </li>
        <li>
          Surfaces and text: <code>--background</code>, <code>--foreground</code>
        </li>
        <li>
          Structural tokens: <code>--border</code>, <code>--muted</code>,{" "}
          <code>--muted-foreground</code>
        </li>
      </ul>
    </>
  );
}
