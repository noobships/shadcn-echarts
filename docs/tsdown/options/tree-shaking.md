# Tree-shaking - The Elegant Bundler for Libraries

Are you an LLM? You can read better optimized documentation at /options/tree-shaking.md for this page in Markdown format

# Tree-shaking [​](#tree-shaking)

Tree shaking is a process that eliminates unused (dead) code from your final bundle, reducing its size and improving performance. It ensures that only the code you actually use is included in the output.

Tree shaking is **enabled by default** in `tsdown`, but you can disable it if needed:

bash

```
tsdown --no-treeshake
```

### Example [​](#example)

Given the following input code:

src/index.tssrc/util.ts

ts

```
import { hello } from './util'

const x = 1

hello(x)
```

ts

```
export function unused() {
  console.log("I'm unused.")
}

export function hello(x: number) {
  console.log('Hello World')
  console.log(x)
}
```

Here are the two possible outputs, depending on whether tree shaking is enabled:

dist/index.mjs (with tree shaking)dist/index.mjs (without tree shaking)

js

```
function hello(x$1) {
  console.log('Hello World')
  console.log(x$1)
}

const x = 1
hello(x)
```

js

```
function unused() {
  console.log("I'm unused.")
}
function hello(x$1) {
  console.log('Hello World')
  console.log(x$1)
}

const x = 1
hello(x)
```

### Explanation [​](#explanation)

-   **With Tree Shaking:** The `unused` function is removed from the final bundle because it is not called anywhere in the source code.
-   **Without Tree Shaking:** The `unused` function is included in the bundle, even though it is not used, resulting in a larger output.

TIP

Tree shaking is particularly useful for optimizing libraries or large projects with many unused exports. However, if you need to include all code (e.g., for debugging or testing), you can disable it with `--no-treeshake`.