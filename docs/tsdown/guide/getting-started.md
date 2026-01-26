# Getting Started - The Elegant Bundler for Libraries

Are you an LLM? You can read better optimized documentation at /guide/getting-started.md for this page in Markdown format

# Getting Started [​](#getting-started)

🚧 Beta Software

[Rolldown](https://rolldown.rs) is currently in beta status. While it can already handle most production use cases, there may still be bugs and rough edges.

## Installation [​](#installation)

There are several ways to get started with `tsdown`. You can:

-   [Manually install](#manual-installation) it as a development dependency in your project.
-   Use the [starter templates](#starter-templates) to quickly scaffold a new project.
-   Try it online using [StackBlitz](#try-online).

### Manual Installation [​](#manual-installation)

Install `tsdown` as a development dependency using your preferred package manager:

npmpnpmyarnbun

sh

```
npm install -D tsdown
```

sh

```
pnpm add -D tsdown
```

sh

```
yarn add -D tsdown
```

sh

```
bun add -D tsdown
```

Optionally, if you're not using [`isolatedDeclarations`](https://www.typescriptlang.org/tsconfig/#isolatedDeclarations), you should also install TypeScript as a development dependency:

npmpnpmyarnbun

sh

```
npm install -D typescript
```

sh

```
pnpm add -D typescript
```

sh

```
yarn add -D typescript
```

sh

```
bun add -D typescript
```

Compatibility Note

`tsdown` requires Node.js version 20.19 or higher. Please ensure your development environment meets this requirement before installing. While `tsdown` is primarily tested with Node.js, support for Deno and Bun is experimental and may not work as expected.

### Starter Templates [​](#starter-templates)

To get started even faster, you can use the [create-tsdown](https://github.com/rolldown/tsdown/tree/main/packages/create-tsdown) CLI, which provides a set of starter templates for building pure TypeScript libraries, as well as frontend libraries like React and Vue.

npmpnpmyarnbun

sh

```
npm create tsdown@latest
```

sh

```
pnpm create tsdown@latest
```

sh

```
yarn create tsdown@latest
```

sh

```
bun create tsdown@latest
```

These templates includes ready-to-use configurations and best practices for building, testing and linting TypeScript projects.

### Try Online [​](#try-online)

You can try tsdown directly in your browser using StackBlitz:

[![tsdown-starter-stackblitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/rolldown/tsdown-starter-stackblitz)

This template is preconfigured for tsdown, so you can experiment and get started quickly—no local setup required.

## Using the CLI [​](#using-the-cli)

To verify that `tsdown` is installed correctly, run the following command in your project directory:

sh

```
./node_modules/.bin/tsdown --version
```

You can also explore the available CLI options and examples with:

sh

```
./node_modules/.bin/tsdown --help
```

### Your First Bundle [​](#your-first-bundle)

Let's create two source TypeScript files:

src/index.ts

ts

```
import { hello } from './hello.ts'

hello()
```

src/hello.ts

ts

```
export function hello() {
  console.log('Hello tsdown!')
}
```

Next, initialize the `tsdown` configuration file:

tsdown.config.ts

ts

```
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
})
```

Now, run the following command to bundle your code:

sh

```
./node_modules/.bin/tsdown
```

You should see the bundled output written to `dist/index.mjs`. To verify it works, run the output file:

sh

```
node dist/index.mjs
```

You should see the message `Hello tsdown!` printed to the console.

### Using the CLI in npm Scripts [​](#using-the-cli-in-npm-scripts)

To simplify the command, you can add it to your `package.json` scripts:

package.json

json

```
{
  "name": "my-tsdown-project",
  "type": "module",
  "scripts": {
    "build": "tsdown"
  },
  "devDependencies": {
    "tsdown": "^0.9.0"
  }
}
```

Now, you can build your project with:

sh

```
npm run build
```

## Using the Config File [​](#using-the-config-file)

While you can use the CLI directly, it's recommended to use a configuration file for more complex projects. This allows you to define and manage your build settings in a centralized and reusable way.

For more details, refer to the [Config File](./../options/config-file) documentation.

## Using Plugins [​](#using-plugins)

`tsdown` supports plugins to extend its functionality. You can use Rolldown plugins, Unplugin plugins, and most Rollup plugins seamlessly. To use plugins, add them to the `plugins` array in your configuration file. For example:

tsdown.config.ts

ts

```
import SomePlugin from 'some-plugin'
import { defineConfig } from 'tsdown'

export default defineConfig({
  plugins: [SomePlugin()],
})
```

For more details, refer to the [Plugins](./../advanced/plugins) documentation.

## Using Watch Mode [​](#using-watch-mode)

You can enable watch mode to automatically rebuild your project whenever files change. This is particularly useful during development to streamline your workflow. Use the `--watch` (or `-w`) option:

bash

```
tsdown --watch
```

For more details, refer to the [Watch Mode](./../options/watch-mode) documentation.