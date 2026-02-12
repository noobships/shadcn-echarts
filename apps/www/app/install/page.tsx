import { NAMESPACE, PACKAGE_NAME, SITE_URL, registryItemUrl } from "../../lib/site-config";

export default function InstallPage() {
  return (
    <>
      <h1>Install shadcn-echarts</h1>
      <p className="lead">
        Choose the workflow that fits your project. All methods below are supported.
      </p>

      <h2>1) npm package (core library)</h2>
      <pre>
        <code>{`pnpm add ${PACKAGE_NAME} echarts react`}</code>
      </pre>
      <pre>
        <code>{`import { BarChart } from "${PACKAGE_NAME}"`}</code>
      </pre>

      <h2>2) Direct shadcn add URL</h2>
      <p>Install a single chart component directly from this registry:</p>
      <pre>
        <code>{`npx shadcn@latest add ${registryItemUrl("line-chart")}`}</code>
      </pre>

      <h2>3) Namespace registry in components.json</h2>
      <p>
        Add a registry namespace once, then install components with a short name:
      </p>
      <pre>
        <code>{`{
  "$schema": "https://ui.shadcn.com/schema.json",
  "registries": {
    "${NAMESPACE}": "${SITE_URL}/r/{name}.json"
  }
}`}</code>
      </pre>
      <pre>
        <code>{`npx shadcn@latest add ${NAMESPACE}/bar-chart`}</code>
      </pre>

      <h2>4) Manual copy and ownership</h2>
      <p>
        If you want full ownership, copy components from
        <code>registry/default/</code> into your project and adapt as needed.
      </p>

      <div className="panel">
        <strong>Smoke-test checklist</strong>
        <ul>
          <li>Create a fresh app, run one method, and render `BarChart` once.</li>
          <li>Verify `echarts` and `react` peer dependencies are installed.</li>
          <li>Toggle light and dark mode to confirm theme auto-sync.</li>
        </ul>
      </div>
    </>
  );
}
