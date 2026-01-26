# Programmatic Usage - The Elegant Bundler for Libraries

Are you an LLM? You can read better optimized documentation at /advanced/programmatic-usage.md for this page in Markdown format

# Programmatic Usage [​](#programmatic-usage)

You can use `tsdown` directly from your JavaScript or TypeScript code. This is useful for custom build scripts, integrations, or advanced automation.

## Example [​](#example)

ts

```
import { build } from 'tsdown'

await build({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  dts: true,
  // ...any other options
})
```

All CLI options are available as properties in the options object. See [Config Options](./../reference/api/Interface.UserConfig) for the full list.