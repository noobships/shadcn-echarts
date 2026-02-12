import { registryItemUrl } from "../../lib/site-config";

const componentExamples = [
  "area-chart",
  "bar-chart",
  "line-chart",
  "pie-chart",
  "radar-chart",
  "scatter-chart",
  "heatmap-chart",
  "sankey-chart",
  "treemap-chart",
  "bar-3d-chart",
  "globe-3d-chart",
  "surface-3d-chart",
];

export default function ComponentsPage() {
  return (
    <>
      <h1>Components and examples</h1>
      <p className="lead">
        Registry currently includes 36 chart components (2D + 3D/WebGL).
      </p>

      <h2>Install examples</h2>
      {componentExamples.map((name) => (
        <pre key={name}>
          <code>{`npx shadcn@latest add ${registryItemUrl(name)}`}</code>
        </pre>
      ))}

      <h2>Interactive demo</h2>
      <p>
        For broad example exploration, use the demo workspace in this repository:
      </p>
      <pre>
        <code>{`pnpm -C demo dev`}</code>
      </pre>
      <p>
        Demo source:{" "}
        <a
          href="https://github.com/noobships/shadcn-echarts/tree/main/demo"
          target="_blank"
          rel="noreferrer"
        >
          github.com/noobships/shadcn-echarts/tree/main/demo
        </a>
      </p>
    </>
  );
}
