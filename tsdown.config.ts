import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/hooks/index.ts', 'src/themes/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  platform: 'neutral',
  target: 'es2022',
  exports: {
    all: true,
  },
  external: ['react', 'react-dom', 'echarts'],
})
