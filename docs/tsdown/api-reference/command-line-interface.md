# Command Line Interface - The Elegant Bundler for Libraries

Are you an LLM? You can read better optimized documentation at /reference/cli.md for this page in Markdown format

# Command Line Interface [​](#command-line-interface)

All CLI flags can also be set in the configuration file, which improves reusability and maintainability for complex projects. Conversely, any option can be overridden by CLI flags, even if not explicitly listed on this page. For more details, see the [Config File](./../options/config-file) documentation.

## CLI Flag Patterns [​](#cli-flag-patterns)

The mapping between CLI flags and configuration options follows these rules:

-   `--foo` sets `foo: true`
-   `--no-foo` sets `foo: false`
-   `--foo.bar` sets `foo: { bar: true }`
-   `--format esm --format cjs` sets `format: ['esm', 'cjs']`

This flexible pattern allows you to easily control and override configuration options directly from the command line.

## `[...files]` [​](#files)

Specify entry files as command arguments. This is equivalent to setting the `entry` option in the configuration file. For example:

bash

```
tsdown src/index.ts src/util.ts
```

This will bundle `src/index.ts` and `src/util.ts` as separate entry points. See the [Entry](./../options/entry) documentation for more details.

## `-c, --config <filename>` [​](#c-config-filename)

Specify a custom configuration file. Use this option to define the path to the configuration file you want to use.

See also [Config File](./../options/config-file).

## `--config-loader <loader>` [​](#config-loader-loader)

Specifies which config loader to use.

See also [Config File](./../options/config-file).

## `--no-config` [​](#no-config)

Disable loading a configuration file. This is useful if you want to rely solely on command-line options or default settings.

See also [Disabling the Config File](./../options/config-file#disable-config-file).

## `--tsconfig <tsconfig>` [​](#tsconfig-tsconfig)

Specify the path or filename of your `tsconfig` file. `tsdown` will search upwards from the current directory to find the specified file. By default, it uses `tsconfig.json`.

bash

```
tsdown --tsconfig tsconfig.build.json
```

## `--format <format>` [​](#format-format)

Define the bundle format. Supported formats include:

-   `esm` (ECMAScript Modules)
-   `cjs` (CommonJS)
-   `iife` (Immediately Invoked Function Expression)
-   `umd` (Universal Module Definition)

See also [Output Format](./../options/output-format).

## `--clean` [​](#clean)

Clean the output directory before building. This removes all files in the output directory to ensure a fresh build.

See also [Cleaning](./../options/cleaning).

## `--external <module>` [​](#external-module)

Mark a module as external. This prevents the specified module from being included in the bundle.

See also [Dependencies](./../options/dependencies).

## `--minify` [​](#minify)

Enable minification of the output bundle to reduce file size. Minification removes unnecessary characters and optimizes the code for production.

See also [Minification](./../options/minification).

## `--target <target>` [​](#target-target)

Specify the JavaScript target version for the bundle. Examples include:

-   `es2015`
-   `esnext`
-   `chrome100`
-   `node18`

You can also disable all syntax transformations by using `--no-target` or by setting the target to `false` in your configuration file.

See also [Target](./../options/target).

## `--log-level <level>` [​](#log-level-level)

Set the log level to control the verbosity of logs during the build process.

See also [Log Level](./../options/log-level).

### `--silent` [​](#silent)

**Deprecated:** Please use `--log-level error` instead for better compatibility.

Suppress non-error logs during the build process. Only error messages will be displayed, making it easier to focus on critical issues.

## `-d, --out-dir <dir>` [​](#d-out-dir-dir)

Specify the output directory for the bundled files. Use this option to customize where the output files are written.

See also [Output Directory](./../options/output-directory).

## `--treeshake`, `--no-treeshake` [​](#treeshake-no-treeshake)

Enable or disable tree shaking. Tree shaking removes unused code from the final bundle, reducing its size and improving performance.

See also [Tree Shaking](./../options/tree-shaking).

## `--sourcemap` [​](#sourcemap)

Generate source maps for the bundled files. Source maps help with debugging by mapping the output code back to the original source files.

See also [Source Maps](./../options/sourcemap).

## `--shims` [​](#shims)

Enable CommonJS (CJS) and ECMAScript Module (ESM) shims. This ensures compatibility between different module systems.

See also [Shims](./../options/shims).

## `--platform <platform>` [​](#platform-platform)

Specify the target platform for the bundle. Supported platforms include:

-   `node` (Node.js)
-   `browser` (Web browsers)
-   `neutral` (Platform-agnostic)

See also [Platform](./../options/platform).

## `--dts` [​](#dts)

Generate TypeScript declaration (`.d.ts`) files for the bundled code. This is useful for libraries that need to provide type definitions.

See also [Declaration Files](./../options/dts).

## `--publint` [​](#publint)

Enable `publint` to validate your package for publishing. This checks for common issues in your package configuration, ensuring it meets best practices.

## `--unused` [​](#unused)

Enable unused dependencies checking. This helps identify dependencies in your project that are not being used, allowing you to clean up your `package.json`.

## `-w, --watch [path]` [​](#w-watch-path)

Enable watch mode to automatically rebuild your project when files change. Optionally, specify a path to watch for changes.

See also [Watch Mode](./../options/watch-mode).

## `--ignore-watch <path>` [​](#ignore-watch-path)

Ignore custom paths in watch mode.

## `--from-vite [vitest]` [​](#from-vite-vitest)

Reuse configuration from Vite or Vitest. This allows you to extend or integrate with existing Vite or Vitest configurations seamlessly.

See also [Extending Vite or Vitest Config](./../options/config-file#extending-vite-or-vitest-config-experimental).

## `--report`, `--no-report` [​](#report-no-report)

Enable or disable the generation of a build report. By default, the report is enabled and outputs the list of build artifacts along with their sizes to the console. This provides a quick overview of the build results, helping you analyze the output and identify potential optimizations. Disabling the report can be useful in scenarios where minimal console output is desired.

## `--env.* <value>` [​](#env-value)

Define compile-time environment variables, for example:

bash

```
tsdown --env.NODE_ENV=production
```

Note that environment variables defined with `--env.VAR_NAME` can only be accessed as `import.meta.env.VAR_NAME` or `process.env.VAR_NAME`.

## `--env-file <file>` [​](#env-file-file)

Load environment variables from a file. When used together with `--env`, variables in `--env` take precedence.

TIP

To prevent accidental exposure of sensitive information, only environment variables prefixed with `TSDOWN_` are injected by default. You can customize this behavior using the [`--env-prefix`](#env-prefix) flag.

bash

```
tsdown --env-file .env.production
```

## `--env-prefix <prefix>` [​](#env-prefix)

When loading environment variables from a file via `--env-file`, only include variables that start with these prefixes.

-   **Default:** `TSDOWN_`

bash

```
tsdown --env-file .env --env-prefix APP_ --env-prefix TSDOWN_
```

## `--debug [feat]` [​](#debug-feat)

Show debug logs.

## `--on-success <command>` [​](#on-success-command)

Specify a command to run after a successful build. This is especially useful in watch mode to trigger additional scripts or actions automatically after each build completes.

bash

```
tsdown --on-success "echo Build finished!"
```

## `--copy <dir>` [​](#copy-dir)

Copies all files from the specified directory to the output directory. This is useful for including static assets such as images, stylesheets, or other resources in your build output.

bash

```
tsdown --copy public
```

All contents of the `public` directory will be copied to your output directory (e.g., `dist`).

## `--public-dir <dir>` [​](#public-dir-dir)

An alias for `--copy`. **Deprecated:** Please use `--copy` instead for better clarity and consistency.

## `--exports` [​](#exports)

generate the `exports`, `main`, `module`, and `types` fields in your `package.json`.

See also [Package Exports](./../options/package-exports).