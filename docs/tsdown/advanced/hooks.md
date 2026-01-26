# Hooks - The Elegant Bundler for Libraries

Are you an LLM? You can read better optimized documentation at /advanced/hooks.md for this page in Markdown format

# Hooks [​](#hooks)

Inspired by [unbuild](https://github.com/unjs/unbuild), `tsdown` supports a flexible hooks system that allows you to extend and customize the build process. While we recommend using the [plugin system](./plugins) for most build-related extensions, hooks provide a convenient way to inject Rolldown plugins or perform additional tasks at specific stages of the build lifecycle.

## Usage [​](#usage)

You can define hooks in your configuration file in two ways:

### Passing an Object [​](#passing-an-object)

Define your hooks as an object, where each key is a hook name and the value is a function:

tsdown.config.ts

ts

```
import { defineConfig } from 'tsdown'

export default defineConfig({
  hooks: {
    'build:done': async () => {
      await doSomething()
    },
  },
})
```

### Passing a Function [​](#passing-a-function)

Alternatively, you can pass a function that receives the hooks object, allowing you to register hooks programmatically:

tsdown.config.ts

ts

```
import { defineConfig } from 'tsdown'

export default defineConfig({
  hooks(hooks) {
    hooks.hook('build:prepare', () => {
      console.log('Hello World')
    })
  },
})
```

For more details on how to use the hooks, refer to the [hookable](https://github.com/unjs/hookable) documentation.

## Available Hooks [​](#available-hooks)

For detailed type definitions, see [`src/features/hooks.ts`](https://github.com/rolldown/tsdown/blob/main/src/features/hooks.ts).

### `build:prepare` [​](#build-prepare)

Invoked before each tsdown build starts. Use this hook to perform setup or preparation tasks.

### `build:before` [​](#build-before)

Invoked before each Rolldown build. For dual-format builds, this hook is called for each format. Useful for configuring or modifying the build context before bundling.

### `build:done` [​](#build-done)

Invoked after each tsdown build completes. Use this hook for cleanup or post-processing tasks.