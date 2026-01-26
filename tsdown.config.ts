import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'hooks/index': 'src/hooks/index.ts',
    'themes/index': 'src/themes/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  platform: 'neutral',
  // @ts-expect-error - exports is valid in tsdown 0.3.1 but types may be outdated
  exports: {
    all: true,
  },
  external: ['react', 'react-dom', 'echarts'],
})
