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
      <p>
        2D charts are zero-setup. 3D/WebGL charts require
        {" "}
        <code>echarts-gl</code> and are currently early (not yet broadly
        battle-tested).
      </p>

      <h2>Install examples</h2>
      {componentExamples.map((name) => (
        <pre key={name}>
          <code>{`npx shadcn@latest add ${registryItemUrl(name)}`}</code>
        </pre>
      ))}

      <h2>Interactive demo</h2>
      <p>
        For real-world usage, explore the live dashboard demo:
      </p>
      <pre>
        <code>{`https://shadcn-echarts-demo.devstool.dev/dashboard`}</code>
      </pre>
      <p>
        Demo repository:{" "}
        <a
          href="https://github.com/noobships/shadcn-echarts-demo"
          target="_blank"
          rel="noreferrer"
        >
          github.com/noobships/shadcn-echarts-demo
        </a>
      </p>
      <p>
        Local workspace demo in this repo is still available via:
      </p>
      <pre>
        <code>{`pnpm -C demo dev`}</code>
      </pre>
    </>
  );
}
