# Interface: UserConfig - The Elegant Bundler for Libraries

Are you an LLM? You can read better optimized documentation at /reference/api/Interface.UserConfig.md for this page in Markdown format

# Interface: UserConfig [​](#interface-userconfig)

Defined in: [src/config/types.ts:136](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L136)

Options for tsdown.

## Extended by [​](#extended-by)

-   [`InlineConfig`](./Interface.InlineConfig)

## Properties [​](#properties)

### alias? [​](#alias)

ts

```
optional alias: Record<string, string>;
```

Defined in: [src/config/types.ts:168](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L168)

---

### attw? [​](#attw)

ts

```
optional attw: WithEnabled<AttwOptions>;
```

Defined in: [src/config/types.ts:500](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L500)

Run `arethetypeswrong` after bundling. Requires `@arethetypeswrong/core` to be installed.

#### Default [​](#default)

ts

```
false
```

#### See [​](#see)

[https://github.com/arethetypeswrong/arethetypeswrong.github.io](https://github.com/arethetypeswrong/arethetypeswrong.github.io)

---

### banner? [​](#banner)

ts

```
optional banner: ChunkAddon;
```

Defined in: [src/config/types.ts:352](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L352)

---

### bundle? [​](#bundle)

ts

```
optional bundle: boolean;
```

Defined in: [src/config/types.ts:365](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L365)

#### Deprecated [​](#deprecated)

Use `unbundle` instead.

#### Default [​](#default-1)

ts

```
true
```

---

### checks? [​](#checks)

ts

```
optional checks: ChecksOptions & object;
```

Defined in: [src/config/types.ts:293](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L293)

Controls which warnings are emitted during the build process. Each option can be set to `true` (emit warning) or `false` (suppress warning).

#### Type Declaration [​](#type-declaration)

##### legacyCjs? [​](#legacycjs)

ts

```
optional legacyCjs: boolean;
```

If the config includes the `cjs` format and one of its target >= node 20.19.0 / 22.12.0, warn the user about the deprecation of CommonJS.

###### Default [​](#default-2)

ts

```
true
```

---

### cjsDefault? [​](#cjsdefault)

ts

```
optional cjsDefault: boolean;
```

Defined in: [src/config/types.ts:391](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L391)

#### Default [​](#default-3)

ts

```
true
```

---

### clean? [​](#clean)

ts

```
optional clean: boolean | string[];
```

Defined in: [src/config/types.ts:346](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L346)

Clean directories before build.

Default to output directory.

#### Default [​](#default-4)

ts

```
true
```

---

### copy? [​](#copy)

ts

```
optional copy:
  | CopyOptions
  | CopyOptionsFn;
```

Defined in: [src/config/types.ts:546](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L546)

Copy files to another directory.

#### Example [​](#example)

ts

```
;[
  'src/assets',
  'src/env.d.ts',
  'src/styles/**/*.css',
  { from: 'src/assets', to: 'dist/assets' },
  { from: 'src/styles/**/*.css', to: 'dist', flatten: true },
]
```

---

### css? [​](#css)

ts

```
optional css: CssOptions;
```

Defined in: [src/config/types.ts:526](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L526)

**\[experimental\]** CSS options.

---

### customLogger? [​](#customlogger)

ts

```
optional customLogger: Logger;
```

Defined in: [src/config/types.ts:433](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L433)

Custom logger.

---

### cwd? [​](#cwd)

ts

```
optional cwd: string;
```

Defined in: [src/config/types.ts:411](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L411)

The working directory of the config file.

-   Defaults to `process.cwd()` for root config.
-   Defaults to the package directory for workspace config.

---

### define? [​](#define)

ts

```
optional define: Record<string, string>;
```

Defined in: [src/config/types.ts:237](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L237)

---

### devtools? [​](#devtools)

ts

```
optional devtools: WithEnabled<DevtoolsOptions>;
```

Defined in: [src/config/types.ts:459](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L459)

**\[experimental\]** Enable devtools.

DevTools is still under development, and this is for early testers only.

This may slow down the build process significantly.

#### Default [​](#default-5)

ts

```
false
```

---

### dts? [​](#dts)

ts

```
optional dts: WithEnabled<DtsOptions>;
```

Defined in: [src/config/types.ts:477](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L477)

Enables generation of TypeScript declaration files (`.d.ts`).

By default, this option is auto-detected based on your project's `package.json`:

-   If the `types` field is present, or if the main `exports` contains a `types` entry, declaration file generation is enabled by default.
-   Otherwise, declaration file generation is disabled by default.

---

### entry? [​](#entry)

ts

```
optional entry: TsdownInputOption;
```

Defined in: [src/config/types.ts:149](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L149)

Defaults to `'src/index.ts'` if it exists.

Supports glob patterns with negation to exclude files:

#### Example [​](#example-1)

ts

```
entry: {
  "hooks/*": ["./src/hooks/*.ts", "!./src/hooks/index.ts"],
}
```

---

### env? [​](#env)

ts

```
optional env: Record<string, any>;
```

Defined in: [src/config/types.ts:225](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L225)

Compile-time env variables, which can be accessed via `import.meta.env` or `process.env`.

#### Example [​](#example-2)

json

```
{
  "DEBUG": true,
  "NODE_ENV": "production"
}
```

---

### envFile? [​](#envfile)

ts

```
optional envFile: string;
```

Defined in: [src/config/types.ts:231](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L231)

Path to env file providing compile-time env variables.

#### Example [​](#example-3)

ts

```
`.env`, `.env.production`, etc.
```

---

### envPrefix? [​](#envprefix)

ts

```
optional envPrefix: string | string[];
```

Defined in: [src/config/types.ts:236](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L236)

When loading env variables from `envFile`, only include variables with these prefixes.

#### Default [​](#default-6)

ts

```
'TSDOWN_'
```

---

### exports? [​](#exports)

ts

```
optional exports: WithEnabled<ExportsOptions>;
```

Defined in: [src/config/types.ts:521](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L521)

Generate package exports for `package.json`.

This will set the `main`, `module`, `types`, `exports` fields in `package.json` to point to the generated files.

---

### external? [​](#external)

ts

```
optional external:
  | string
  | RegExp
  | (string | RegExp)[]
  | ExternalOptionFunction;
```

Defined in: [src/config/types.ts:151](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L151)

---

### failOnWarn? [​](#failonwarn)

ts

```
optional failOnWarn: boolean | CIOption;
```

Defined in: [src/config/types.ts:429](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L429)

If true, fails the build on warnings.

#### Default [​](#default-7)

ts

```
'ci-only'
```

---

### fixedExtension? [​](#fixedextension)

ts

```
optional fixedExtension: boolean;
```

Defined in: [src/config/types.ts:374](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L374)

Use a fixed extension for output files. The extension will always be `.cjs` or `.mjs`. Otherwise, it will depend on the package type.

Defaults to `true` if `platform` is set to `node`, `false` otherwise.

---

### footer? [​](#footer)

ts

```
optional footer: ChunkAddon;
```

Defined in: [src/config/types.ts:351](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L351)

---

### format? [​](#format)

ts

```
optional format:
  | "es" | "cjs" | "iife" | "umd" | "module" | "commonjs" | "esm"
  | Partial<Record<"es" | "cjs" | "iife" | "umd" | "module" | "commonjs" | "esm", Partial<ResolvedConfig>>>
  | ("es" | "cjs" | "iife" | "umd" | "module" | "commonjs" | "esm")[];
```

Defined in: [src/config/types.ts:320](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L320)

#### Default [​](#default-8)

ts

```
'es'
```

---

### fromVite? [​](#fromvite)

ts

```
optional fromVite: boolean | "vitest";
```

Defined in: [src/config/types.ts:439](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L439)

Reuse config from Vite or Vitest (experimental)

#### Default [​](#default-9)

ts

```
false
```

---

### globalName? [​](#globalname)

ts

```
optional globalName: string;
```

Defined in: [src/config/types.ts:321](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L321)

---

### globImport? [​](#globimport)

ts

```
optional globImport: boolean;
```

Defined in: [src/config/types.ts:513](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L513)

`import.meta.glob` support.

#### See [​](#see-1)

[https://vite.dev/guide/features.html#glob-import](https://vite.dev/guide/features.html#glob-import)

#### Default [​](#default-10)

ts

```
true
```

---

### hash? [​](#hash)

ts

```
optional hash: boolean;
```

Defined in: [src/config/types.ts:386](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L386)

If enabled, appends hash to chunk filenames.

#### Default [​](#default-11)

ts

```
true
```

---

### hooks? [​](#hooks)

ts

```
optional hooks:
  | Partial<TsdownHooks>
| (hooks) => Awaitable<void>;
```

Defined in: [src/config/types.ts:548](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L548)

---

### ignoreWatch? [​](#ignorewatch)

ts

```
optional ignoreWatch: Arrayable<string | RegExp>;
```

Defined in: [src/config/types.ts:448](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L448)

Files or patterns to not watch while in watch mode.

---

### inlineOnly? [​](#inlineonly)

ts

```
optional inlineOnly: false | Arrayable<string | RegExp>;
```

Defined in: [src/config/types.ts:161](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L161)

Bundle only the dependencies listed here; throw an error if any others are missing.

-   `undefined` (default): Show warnings for bundled dependencies.
-   `false`: Suppress all warnings about `inlineOnly` option.

Note: Be sure to include all required sub-dependencies as well.

---

### inputOptions? [​](#inputoptions)

ts

```
optional inputOptions:
  | InputOptions
| (options, format, context) => Awaitable<void | InputOptions | null>;
```

Defined in: [src/config/types.ts:309](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L309)

Use with caution; ensure you understand the implications.

---

### loader? [​](#loader)

ts

```
optional loader: ModuleTypes;
```

Defined in: [src/config/types.ts:258](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L258)

Sets how input files are processed. For example, use 'js' to treat files as JavaScript or 'base64' for images. Lets you import or require files like images or fonts.

#### Example [​](#example-4)

json

```
{ ".jpg": "asset", ".png": "base64" }
```

---

### logLevel? [​](#loglevel)

ts

```
optional logLevel: LogLevel;
```

Defined in: [src/config/types.ts:424](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L424)

Log level.

#### Default [​](#default-12)

ts

```
'info'
```

---

### minify? [​](#minify)

ts

```
optional minify:
  | boolean
  | MinifyOptions
  | "dce-only";
```

Defined in: [src/config/types.ts:350](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L350)

#### Default [​](#default-13)

ts

```
false
```

---

### name? [​](#name)

ts

```
optional name: string;
```

Defined in: [src/config/types.ts:418](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L418)

The name to show in CLI output. This is useful for monorepos or workspaces. When using workspace mode, this option defaults to the package name from package.json. In non-workspace mode, this option must be set explicitly for the name to show in the CLI output.

---

### nodeProtocol? [​](#nodeprotocol)

ts

```
optional nodeProtocol: boolean | "strip";
```

Defined in: [src/config/types.ts:288](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L288)

-   If `true`, add `node:` prefix to built-in modules.
-   If `'strip'`, strips the `node:` protocol prefix from import source.
-   If `false`, does not modify the import source.

#### Default [​](#default-14)

ts

```
false
```

#### Example [​](#example-5)

ts

```
// With nodeProtocol enabled:
import('fs') // becomes import('node:fs')
// With nodeProtocol set to 'strip':
import('node:fs') // becomes import('fs')
// With nodeProtocol set to false:
import('node:fs') // remains import('node:fs')
```

---

### noExternal? [​](#noexternal)

ts

```
optional noExternal:
  | Arrayable<string | RegExp>
  | NoExternalFn;
```

Defined in: [src/config/types.ts:152](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L152)

---

### onSuccess? [​](#onsuccess)

ts

```
optional onSuccess: string | (config, signal) => void | Promise<void>;
```

Defined in: [src/config/types.ts:466](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L466)

You can specify command to be executed after a successful build, specially useful for Watch mode

---

### outDir? [​](#outdir)

ts

```
optional outDir: string;
```

Defined in: [src/config/types.ts:323](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L323)

#### Default [​](#default-15)

ts

```
'dist'
```

---

### outExtensions? [​](#outextensions)

ts

```
optional outExtensions: OutExtensionFactory;
```

Defined in: [src/config/types.ts:380](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L380)

Custom extensions for output files. `fixedExtension` will be overridden by this option.

---

### outputOptions? [​](#outputoptions)

ts

```
optional outputOptions:
  | OutputOptions
| (options, format, context) => Awaitable<void | OutputOptions | null>;
```

Defined in: [src/config/types.ts:396](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L396)

Use with caution; ensure you understand the implications.

---

### platform? [​](#platform)

ts

```
optional platform: "browser" | "node" | "neutral";
```

Defined in: [src/config/types.ts:182](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L182)

Specifies the target runtime platform for the build.

-   `node`: Node.js and compatible runtimes (e.g., Deno, Bun). For CJS format, this is always set to `node` and cannot be changed.
-   `neutral`: A platform-agnostic target with no specific runtime assumptions.
-   `browser`: Web browsers.

#### Default [​](#default-16)

ts

```
'node'
```

#### See [​](#see-2)

[https://tsdown.dev/options/platform](https://tsdown.dev/options/platform)

---

### plugins? [​](#plugins)

ts

```
optional plugins: RolldownPluginOption<any>;
```

Defined in: [src/config/types.ts:304](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L304)

---

### publicDir? [​](#publicdir)

ts

```
optional publicDir:
  | CopyOptions
  | CopyOptionsFn;
```

Defined in: [src/config/types.ts:531](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L531)

#### Deprecated [​](#deprecated-1)

Alias for `copy`, will be removed in the future.

---

### publint? [​](#publint)

ts

```
optional publint: WithEnabled<PublintOptions>;
```

Defined in: [src/config/types.ts:491](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L491)

Run publint after bundling. Requires `publint` to be installed.

#### Default [​](#default-17)

ts

```
false
```

---

### removeNodeProtocol? [​](#removenodeprotocol)

ts

```
optional removeNodeProtocol: boolean;
```

Defined in: [src/config/types.ts:270](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L270)

If enabled, strips the `node:` protocol prefix from import source.

#### Default [​](#default-18)

ts

```
false
```

#### Deprecated [​](#deprecated-2)

Use `nodeProtocol: 'strip'` instead.

#### Example [​](#example-6)

ts

```
// With removeNodeProtocol enabled:
import('node:fs') // becomes import('fs')
```

---

### report? [​](#report)

ts

```
optional report: WithEnabled<ReportOptions>;
```

Defined in: [src/config/types.ts:506](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L506)

Enable size reporting after bundling.

#### Default [​](#default-19)

ts

```
true
```

---

### shims? [​](#shims)

ts

```
optional shims: boolean;
```

Defined in: [src/config/types.ts:240](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L240)

#### Default [​](#default-20)

ts

```
false
```

---

### skipNodeModulesBundle? [​](#skipnodemodulesbundle)

ts

```
optional skipNodeModulesBundle: boolean;
```

Defined in: [src/config/types.ts:166](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L166)

Skip bundling `node_modules`.

#### Default [​](#default-21)

ts

```
false
```

---

### sourcemap? [​](#sourcemap)

ts

```
optional sourcemap: Sourcemap;
```

Defined in: [src/config/types.ts:339](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L339)

Whether to generate source map files.

Note that this option will always be `true` if you have [`declarationMap`](https://www.typescriptlang.org/tsconfig/#declarationMap) option enabled in your `tsconfig.json`.

#### Default [​](#default-22)

ts

```
false
```

---

### target? [​](#target)

ts

```
optional target: string | false | string[];
```

Defined in: [src/config/types.ts:213](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L213)

Specifies the compilation target environment(s).

Determines the JavaScript version or runtime(s) for which the code should be compiled. If not set, defaults to the value of `engines.node` in your project's `package.json`. If no `engines.node` field exists, no syntax transformations are applied.

Accepts a single target (e.g., `'es2020'`, `'node18'`), an array of targets, or `false` to disable all transformations.

#### See [​](#see-3)

[https://tsdown.dev/options/target#supported-targets](https://tsdown.dev/options/target#supported-targets) for a list of valid targets and more details.

#### Examples [​](#examples)

jsonc

```
// Target a single environment
{ "target": "node18" }
```

jsonc

```
// Target multiple environments
{ "target": ["node18", "es2020"] }
```

jsonc

```
// Disable all syntax transformations
{ "target": false }
```

---

### treeshake? [​](#treeshake)

ts

```
optional treeshake: boolean | TreeshakingOptions;
```

Defined in: [src/config/types.ts:247](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L247)

Configure tree shaking options.

#### See [​](#see-4)

[https://rolldown.rs/options/treeshake](https://rolldown.rs/options/treeshake) for more details.

#### Default [​](#default-23)

ts

```
true
```

---

### tsconfig? [​](#tsconfig)

ts

```
optional tsconfig: string | boolean;
```

Defined in: [src/config/types.ts:169](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L169)

---

### unbundle? [​](#unbundle)

ts

```
optional unbundle: boolean;
```

Defined in: [src/config/types.ts:359](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L359)

Determines whether unbundle mode is enabled. When set to true, the output files will mirror the input file structure.

#### Default [​](#default-24)

ts

```
false
```

---

### unused? [​](#unused)

ts

```
optional unused: WithEnabled<UnusedOptions>;
```

Defined in: [src/config/types.ts:484](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L484)

Enable unused dependencies check with `unplugin-unused` Requires `unplugin-unused` to be installed.

#### Default [​](#default-25)

ts

```
false
```

---

### watch? [​](#watch)

ts

```
optional watch: boolean | Arrayable<string>;
```

Defined in: [src/config/types.ts:444](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L444)

#### Default [​](#default-26)

ts

```
false
```

---

### workspace? [​](#workspace)

ts

```
optional workspace: true | Arrayable<string> | Workspace;
```

Defined in: [src/config/types.ts:556](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L556)

**\[experimental\]** Enable workspace mode. This allows you to build multiple packages in a monorepo.

---

### write? [​](#write)

ts

```
optional write: boolean;
```

Defined in: [src/config/types.ts:329](https://github.com/rolldown/tsdown/blob/13f1c5dfa73445728c285e7a55d921e748be1e59/src/config/types.ts#L329)

Whether to write the files to disk. This option is incompatible with watch mode.

#### Default [​](#default-27)

ts

```
true
```