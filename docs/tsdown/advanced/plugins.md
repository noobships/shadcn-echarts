# Plugins - The Elegant Bundler for Libraries

Are you an LLM? You can read better optimized documentation at /advanced/plugins.md for this page in Markdown format

# Plugins [​](#plugins)

`tsdown` uses [Rolldown](https://rolldown.rs) as its core engine, which means it seamlessly supports Rolldown plugins. Plugins are a powerful way to extend and customize the bundling process, enabling features like code transformation, asset handling, and more.

## Supported Plugin Ecosystems [​](#supported-plugin-ecosystems)

### Rolldown Plugins [​](#rolldown-plugins)

Since `tsdown` is built on Rolldown, it supports all Rolldown plugins. You can use any plugin designed for Rolldown to enhance your build process.

### Unplugin [​](#unplugin)

[Unplugin](https://unplugin.unjs.io/) is a modern plugin framework that supports multiple bundlers, including Rolldown. Most Unplugin plugins (commonly named with the `unplugin-` prefix) work seamlessly with `tsdown`.

### Rollup Plugins [​](#rollup-plugins)

Rolldown is highly compatible with Rollup's plugin API, so `tsdown` can use most Rollup plugins without modification. This gives you access to a wide range of existing plugins in the Rollup ecosystem.

Type Compatibility

Rollup plugins may sometimes cause TypeScript type errors because the Rollup and Rolldown plugin APIs are not 100% compatible. If you encounter type errors when using Rollup plugins, you can safely ignore them by using `// @ts-expect-error` or casting the plugin as `any`:

ts

```
import SomeRollupPlugin from 'some-rollup-plugin'
export default defineConfig({
  plugins: [SomeRollupPlugin() as any],
})
```

### Vite Plugins [​](#vite-plugins)

Vite plugins may work with `tsdown` if they do not rely on Vite-specific internal APIs or behaviors. However, plugins that depend heavily on Vite's internals may not be compatible. We plan to improve support for Vite plugins in the future.

Type Compatibility

Similarly, Vite plugins may also cause type errors due to API differences. You can use `// @ts-expect-error` or `as any` to suppress these errors if needed.

## How to Use Plugins [​](#how-to-use-plugins)

To use plugins in `tsdown`, you need to add them to the `plugins` array in your configuration file. Plugins **cannot** be added via the CLI.

Here’s an example of how to use a plugin:

tsdown.config.ts

ts

```
import SomePlugin from 'some-plugin'
import { defineConfig } from 'tsdown'

export default defineConfig({
  plugins: [SomePlugin()],
})
```

For specific plugin usage, refer to the plugin's own documentation.

## Writing Your Own Plugins [​](#writing-your-own-plugins)

If you want to create a custom plugin for `tsdown`, you can follow Rolldown's plugin development guide. Rolldown's plugin API is highly flexible and similar to Rollup's, making it easy to get started.

Refer to the [Rolldown Plugin Development Guide](https://rolldown.rs/guide/plugin-development) for detailed instructions on writing your own plugins.

TIP

Plugins are a great way to extend `tsdown`'s functionality. Whether you're using existing plugins or creating your own, they allow you to tailor the bundling process to your project's specific needs.