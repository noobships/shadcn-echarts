# Entry - The Elegant Bundler for Libraries

Are you an LLM? You can read better optimized documentation at /options/entry.md for this page in Markdown format

# Entry [​](#entry)

The `entry` option specifies the entry files for your project. These files serve as the starting points for the bundling process. You can define entry files either via the CLI or in the configuration file.

## Using the CLI [​](#using-the-cli)

You can specify entry files directly as command arguments when using the CLI. For example:

bash

```
tsdown src/entry1.ts src/entry2.ts
```

This command will bundle `src/entry1.ts` and `src/entry2.ts` as separate entry points.

## Using the Config File [​](#using-the-config-file)

In the configuration file, the `entry` option allows you to define entry files in various formats:

### Single Entry File [​](#single-entry-file)

Specify a single entry file as a string:

tsdown.config.ts

ts

```
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
})
```

### Multiple Entry Files [​](#multiple-entry-files)

Define multiple entry files as an array of strings:

tsdown.config.ts

ts

```
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/entry1.ts', 'src/entry2.ts'],
})
```

### Entry Files with Aliases [​](#entry-files-with-aliases)

Use an object to define entry files with aliases. The keys represent alias names, and the values represent file paths:

tsdown.config.ts

ts

```
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    main: 'src/index.ts',
    utils: 'src/utils.ts',
  },
})
```

This configuration will create two bundles: one for `src/index.ts` (output as `dist/main.js`) and one for `src/utils.ts` (output as `dist/utils.js`).

## Using Glob Patterns [​](#using-glob-patterns)

The `entry` option supports [glob patterns](https://code.visualstudio.com/docs/editor/glob-patterns), enabling you to match multiple files dynamically. For example:

tsdown.config.ts

ts

```
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/**/*.ts',
})
```

This configuration will include all `.ts` files in the `src` directory and its subdirectories as entry points.

TIP

On **Windows**, you must use forward slashes (`/`) instead of backslashes (`\`) in file paths when using glob patterns.