import Link from "next/link";
import { PACKAGE_NAME, registryItemUrl } from "../lib/site-config";

export default function HomePage() {
  return (
    <>
      <h1>shadcn-echarts</h1>
      <p className="lead">
        Beautiful shadcn-style ECharts components.
      </p>
      <p>
        2D charts work out of the box. 3D/WebGL charts are supported with optional
        {" "}
        <code>echarts-gl</code> setup. Use it as an npm dependency, install
        components via shadcn registry, or copy and own the component source in
        your app.
      </p>

      <div className="button-row">
        <Link href="/install" className="button primary">
          Installation methods
        </Link>
        <Link href="/theming" className="button">
          Theme integration
        </Link>
        <Link href="/components" className="button">
          Components and examples
        </Link>
      </div>

      <h2>Quick install</h2>
      <pre>
        <code>{`pnpm add ${PACKAGE_NAME} echarts react`}</code>
      </pre>

      <h2>Quick shadcn add</h2>
      <pre>
        <code>{`npx shadcn@latest add ${registryItemUrl("bar-chart")}`}</code>
      </pre>

      <h2>Live demo</h2>
      <p>
        See the library in a real dashboard app:{" "}
        <a
          href="https://shadcn-echarts-demo.devstool.dev/dashboard"
          target="_blank"
          rel="noreferrer"
        >
          shadcn-echarts-demo.devstool.dev/dashboard
        </a>
      </p>
      <p>
        Source code:{" "}
        <a
          href="https://github.com/noobships/shadcn-echarts-demo"
          target="_blank"
          rel="noreferrer"
        >
          github.com/noobships/shadcn-echarts-demo
        </a>
      </p>

      <div className="panel">
        <strong>What this site provides</strong>
        <ul>
          <li>Install guides for all supported distribution methods.</li>
          <li>Registry endpoint documentation for shadcn CLI usage.</li>
          <li>Theming and preset guidance for production use.</li>
          <li>A component map linked to the interactive demo workspace.</li>
        </ul>
      </div>
    </>
  );
}
