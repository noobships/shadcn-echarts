# Minification - The Elegant Bundler for Libraries

Are you an LLM? You can read better optimized documentation at /options/minification.md for this page in Markdown format

# Minification [​](#minification)

Minification is the process of compressing your code to reduce its size and improve performance by removing unnecessary characters, such as whitespace, comments, and unused code.

You can enable minification in `tsdown` using the `--minify` option:

bash

```
tsdown --minify
```

NOTE

The minification feature is based on [Oxc](https://oxc.rs/docs/contribute/minifier), which is currently in alpha and can still have bugs. We recommend thoroughly testing your output in production environments.

### Example [​](#example)

Given the following input code:

src/index.ts

ts

```
const x = 1

function hello(x: number) {
  console.log('Hello World')
  console.log(x)
}

hello(x)
```

Here are the two possible outputs, depending on whether minification is enabled:

dist/index.mjs (without --minify)dist/index.mjs (with --minify)

js

```
//#region src/index.ts
const x = 1
function hello(x$1) {
  console.log('Hello World')
  console.log(x$1)
}
hello(x)

//#endregion
```

js

```
const e=1;function t(e){console.log(`Hello World`),console.log(e)}t(e);
```