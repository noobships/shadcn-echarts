# Output Directory - The Elegant Bundler for Libraries

Are you an LLM? You can read better optimized documentation at /options/output-directory.md for this page in Markdown format

# Output Directory [​](#output-directory)

By default, `tsdown` bundles your code into the `dist` directory located in the current working folder.

If you want to customize the output directory, you can use the `--out-dir` (or `-d`) option:

bash

```
tsdown -d ./custom-output
```

### Example [​](#example)

bash

```
# Default behavior: outputs to ./dist
tsdown

# Custom output directory: outputs to ./build
tsdown -d ./build
```

NOTE

The specified output directory will be created if it does not already exist. Ensure the directory path aligns with your project structure to avoid overwriting unintended files.