import { defineConfig } from '@playwright/test'
import os from 'node:os'

// In restricted environments (e.g. sandboxed runners), Playwright may fail to
// detect Apple Silicon and download x64 browser builds. Force the correct host
// platform so downloads + launches match `process.arch`.
if (process.platform === 'darwin' && process.arch === 'arm64' && !process.env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE) {
  const major = Number.parseInt(os.release().split('.')[0] ?? '0', 10)

  let macVersion = 'mac15'
  if (major < 18) macVersion = 'mac10.13'
  else if (major === 18) macVersion = 'mac10.14'
  else if (major === 19) macVersion = 'mac10.15'
  else {
    const LAST_STABLE_MACOS_MAJOR_VERSION = 15
    macVersion = `mac${Math.min(major - 9, LAST_STABLE_MACOS_MAJOR_VERSION)}`
  }

  process.env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE = `${macVersion}-arm64`
}

const projects = [{ name: 'chromium', use: { browserName: 'chromium' as const } }]

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: {
    timeout: 15_000,
    toHaveScreenshot: {
      // Small anti-aliasing / canvas diffs are expected across platforms.
      maxDiffPixelRatio: 0.01,
    },
  },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 1280, height: 720 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    animations: 'disabled',
  },
  projects,
  webServer: {
    command: 'pnpm dev --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
})

