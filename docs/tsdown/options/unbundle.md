# Unbundle Mode - The Elegant Bundler for Libraries

Are you an LLM? You can read better optimized documentation at /options/unbundle.md for this page in Markdown format

# Unbundle Mode [​](#unbundle-mode)

The **unbundle** mode in `tsdown` allows you to output files that closely mirror your source module structure, rather than producing a single bundled file for each entry. In this mode, each source file is compiled and transformed individually, and the output directory will contain a one-to-one mapping of your source files to output files. This approach is often referred to as a "bundleless" or "transpile-only" build, where the focus is on transforming code rather than bundling it together.

## How to Enable [​](#how-to-enable)

You can enable unbundle mode by setting the `unbundle` option to `true` in your `tsdown` configuration:

ts

```
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  unbundle: true,
})
```

## How It Works [​](#how-it-works)

When unbundle mode is enabled, every source file that is referenced (directly or indirectly) from your entry points will be compiled and output to the corresponding location in the output directory. This means that the output structure will closely match your source directory structure, making it easy to trace output files back to their original source files.

### Example [​](#example)

Suppose your project has the following files:

```
src/
  index.ts
  mod.ts
```

And `src/index.ts` imports `src/mod.ts`:

src/index.ts

ts

```
import { foo } from './mod'

foo()
```

src/mod.ts

ts

```
export function foo() {
  console.log('Hello from mod!')
}
```

With `unbundle: true`, even though only `src/index.ts` is listed as an entry, both `src/index.ts` and `src/mod.ts` will be compiled and output as separate files:

```
dist/
  index.js
  mod.js
```

Each output file corresponds directly to its source file, preserving the module structure of your original codebase.

## When to Use Unbundle Mode [​](#when-to-use-unbundle-mode)

Unbundle mode is ideal when you want to:

-   Maintain a clear mapping between source and output files.
-   Avoid bundling all modules together, for example in monorepo or library scenarios where consumers may want to import individual modules.
-   Focus on code transformation (e.g., TypeScript to JavaScript) without combining files.