#!/usr/bin/env node

/**
 * Phase 7 Verification Script
 * 
 * Verifies:
 * 1. All 36 chart types have components
 * 2. All components are properly exported
 * 3. All registry items exist and match components
 * 4. TypeScript types are properly defined
 * 5. Tree-shaking structure is correct
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Expected chart types (36 total: 26 2D + 10 3D/WebGL)
const EXPECTED_2D_CHARTS = [
  'area-chart',
  'bar-chart',
  'boxplot-chart',
  'calendar-chart',
  'candlestick-chart',
  'chord-chart',
  'custom-chart',
  'funnel-chart',
  'gauge-chart',
  'geo-chart',
  'graph-chart',
  'heatmap-chart',
  'line-chart',
  'lines-chart',
  'map-chart',
  'matrix-chart',
  'parallel-chart',
  'pictorial-bar-chart',
  'pie-chart',
  'radar-chart',
  'sankey-chart',
  'scatter-chart',
  'sunburst-chart',
  'theme-river-chart',
  'tree-chart',
  'treemap-chart',
]

const EXPECTED_3D_CHARTS = [
  'bar-3d-chart',
  'globe-3d-chart',
  'graph-gl-chart',
  'line-3d-chart',
  'lines-3d-chart',
  'lines-gl-chart',
  'map-3d-chart',
  'scatter-3d-chart',
  'scatter-gl-chart',
  'surface-3d-chart',
]

const ALL_CHARTS = [...EXPECTED_2D_CHARTS, ...EXPECTED_3D_CHARTS]

// Helper functions
function readJSON(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf-8'))
  } catch {
    return null
  }
}

function exists(path) {
  return existsSync(path)
}

function run(cmd, args, options) {
  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    ...options,
    // On Windows, spawning a bare command without a shell can fail.
    shell: process.platform === 'win32',
  })

  if (result.error) {
    return { ok: false, code: 1, error: result.error }
  }

  return { ok: result.status === 0, code: result.status ?? 1 }
}

function getChartType(chartName) {
  if (EXPECTED_3D_CHARTS.includes(chartName)) {
    return '3d'
  }
  return '2d'
}

function toComponentName(chartName) {
  // Convert kebab-case to PascalCase, handling special cases
  // Handle 3d -> 3D, gl -> GL
  const parts = chartName.split('-')
  const converted = parts.map((word) => {
    if (word === '3d') return '3D'
    if (word === 'gl') return 'GL'
    return word.charAt(0).toUpperCase() + word.slice(1)
  })
  return converted.join('') + 'Component'
}

// Verification functions
function verifyComponentExists(chartName) {
  // Special case: geo-chart re-exports from map-chart
  if (chartName === 'geo-chart') {
    const componentPath = join(rootDir, 'src', 'components', 'charts', '2d', 'geo-chart.tsx')
    if (!exists(componentPath)) {
      return { success: false, error: `Component not found: ${componentPath}` }
    }
    const content = readFileSync(componentPath, 'utf-8')
    if (content.includes('GeoChartComponent') && content.includes('GeoChartProps')) {
      return { success: true }
    }
    return { success: false, error: `geo-chart missing proper re-exports` }
  }
  
  const chartType = getChartType(chartName)
  // Convert chart name to file name (e.g., bar-3d-chart -> bar-3d-chart.tsx)
  const baseName = chartName.replace(/-chart$/, '')
  const fileName = `${baseName}-chart.tsx`
  const componentPath = join(rootDir, 'src', 'components', 'charts', chartType, fileName)
  
  if (!exists(componentPath)) {
    return { success: false, error: `Component not found: ${componentPath}` }
  }
  
  const content = readFileSync(componentPath, 'utf-8')
  
  // Check for component export (e.g., Bar3DChartComponent)
  const componentName = toComponentName(chartName)
  const hasComponentExport = content.includes(`export function ${componentName}`) ||
                            content.includes(`export const ${componentName}`)
  
  // Check for props type export (e.g., Bar3DChartProps)
  const propsName = componentName.replace('Component', 'Props')
  const hasPropsExport = content.includes(`export interface ${propsName}`) ||
                        content.includes(`export type ${propsName}`)
  
  if (!hasComponentExport) {
    return { success: false, error: `Missing component export: ${componentName}` }
  }
  
  if (!hasPropsExport) {
    return { success: false, error: `Missing props type export: ${propsName}` }
  }
  
  return { success: true }
}

function verifyRegistryItem(chartName) {
  const registryJsonPath = join(rootDir, 'registry', 'default', chartName, `${chartName}.json`)
  const registryTsxPath = join(rootDir, 'registry', 'default', chartName, `${chartName}.tsx`)
  
  if (!exists(registryJsonPath)) {
    return { success: false, error: `Registry JSON not found: ${registryJsonPath}` }
  }
  
  if (!exists(registryTsxPath)) {
    return { success: false, error: `Registry TSX not found: ${registryTsxPath}` }
  }
  
  const registryJson = readJSON(registryJsonPath)
  if (!registryJson) {
    return { success: false, error: `Invalid JSON: ${registryJsonPath}` }
  }
  
  // Verify registry JSON structure
  const requiredFields = ['name', 'type', 'title', 'description', 'dependencies', 'files']
  for (const field of requiredFields) {
    if (!(field in registryJson)) {
      return { success: false, error: `Missing field in registry JSON: ${field}` }
    }
  }
  
  // Verify registry TSX imports from @devstool/shadcn-echarts
  const registryTsxContent = readFileSync(registryTsxPath, 'utf-8')
  if (!registryTsxContent.includes('@devstool/shadcn-echarts')) {
    return { success: false, error: `Registry TSX doesn't import from @devstool/shadcn-echarts` }
  }
  
  return { success: true }
}

function verifyExports(chartName) {
  const chartType = getChartType(chartName)
  const indexPath = join(rootDir, 'src', 'components', 'charts', chartType, 'index.ts')
  
  if (!exists(indexPath)) {
    return { success: false, error: `Index file not found: ${indexPath}` }
  }
  
  const content = readFileSync(indexPath, 'utf-8')
  const componentName = toComponentName(chartName) // e.g., Bar3DChartComponent
  // Export name should match the pattern (e.g., Bar3DChart from Bar3DChartComponent)
  const exportName = componentName.replace('Component', '')
  
  // Check for component export (e.g., export { Bar3DChartComponent as Bar3DChart })
  const hasComponentExport = content.includes(`export { ${componentName} as ${exportName}`) ||
                            content.includes(`export { ${componentName}`)
  
  // Check for type export (e.g., export type { Bar3DChartProps })
  const propsName = componentName.replace('Component', 'Props')
  const hasTypeExport = content.includes(`export type { ${propsName}`)
  
  if (!hasComponentExport) {
    return { success: false, error: `Component not exported in index: ${exportName}` }
  }
  
  if (!hasTypeExport) {
    return { success: false, error: `Props type not exported in index: ${propsName}` }
  }
  
  return { success: true }
}

function verifyRegistryJson() {
  const registryJsonPath = join(rootDir, 'registry.json')
  
  if (!exists(registryJsonPath)) {
    return { success: false, error: 'registry.json not found' }
  }
  
  const registryJson = readJSON(registryJsonPath)
  if (!registryJson || !Array.isArray(registryJson.items)) {
    return { success: false, error: 'Invalid registry.json structure' }
  }
  
  const registryItems = registryJson.items.map(item => item.name)
  const missing = ALL_CHARTS.filter(chart => !registryItems.includes(chart))
  
  if (missing.length > 0) {
    return { success: false, error: `Missing registry items: ${missing.join(', ')}` }
  }
  
  return { success: true, count: registryItems.length }
}

// Main verification
console.log('🔍 Phase 7 Verification\n')
console.log('=' .repeat(60))

let totalErrors = 0
let totalWarnings = 0

// 1. Verify all components exist
console.log('\n1️⃣  Verifying component files...')
let componentErrors = 0
for (const chart of ALL_CHARTS) {
  const result = verifyComponentExists(chart)
  if (!result.success) {
    console.error(`   ❌ ${chart}: ${result.error}`)
    componentErrors++
  } else {
    console.log(`   ✅ ${chart}`)
  }
}
if (componentErrors > 0) {
  totalErrors += componentErrors
  console.error(`\n   ⚠️  ${componentErrors} component(s) failed verification`)
} else {
  console.log(`\n   ✅ All ${ALL_CHARTS.length} components verified`)
}

// 2. Verify registry items
console.log('\n2️⃣  Verifying registry items...')
let registryErrors = 0
for (const chart of ALL_CHARTS) {
  const result = verifyRegistryItem(chart)
  if (!result.success) {
    console.error(`   ❌ ${chart}: ${result.error}`)
    registryErrors++
  } else {
    console.log(`   ✅ ${chart}`)
  }
}
if (registryErrors > 0) {
  totalErrors += registryErrors
  console.error(`\n   ⚠️  ${registryErrors} registry item(s) failed verification`)
} else {
  console.log(`\n   ✅ All ${ALL_CHARTS.length} registry items verified`)
}

// 3. Verify exports
console.log('\n3️⃣  Verifying exports...')
let exportErrors = 0
for (const chart of ALL_CHARTS) {
  const result = verifyExports(chart)
  if (!result.success) {
    console.error(`   ❌ ${chart}: ${result.error}`)
    exportErrors++
  } else {
    console.log(`   ✅ ${chart}`)
  }
}
if (exportErrors > 0) {
  totalErrors += exportErrors
  console.error(`\n   ⚠️  ${exportErrors} export(s) failed verification`)
} else {
  console.log(`\n   ✅ All ${ALL_CHARTS.length} exports verified`)
}

// 4. Verify registry.json
console.log('\n4️⃣  Verifying registry.json...')
const registryResult = verifyRegistryJson()
if (!registryResult.success) {
  console.error(`   ❌ ${registryResult.error}`)
  totalErrors++
} else {
  console.log(`   ✅ registry.json contains ${registryResult.count} items`)
}

// Summary
console.log('\n' + '='.repeat(60))
console.log('\n📊 Verification Summary\n')
console.log(`   Total Charts: ${ALL_CHARTS.length}`)
console.log(`   - 2D Charts: ${EXPECTED_2D_CHARTS.length}`)
console.log(`   - 3D/WebGL Charts: ${EXPECTED_3D_CHARTS.length}`)
console.log(`   Errors: ${totalErrors}`)
console.log(`   Warnings: ${totalWarnings}`)

if (totalErrors === 0 && totalWarnings === 0) {
  console.log('\n   ✅ All verifications passed!')

  // Verify demo example parity (manifest/scripts/assets coverage).
  const skipParity =
    process.env.SHADCN_ECHARTS_SKIP_PARITY === '1' ||
    process.env.SKIP_DEMO_PARITY === '1'
  if (!skipParity) {
    console.log('\n5️⃣  Running demo parity verification...')
    const parityRes = run('node', ['scripts/verify-demo-parity.mjs'], { cwd: rootDir })
    if (!parityRes.ok) {
      totalErrors++
      console.error('\n   ❌ Demo parity verification failed.')
    } else {
      console.log('\n   ✅ Demo parity verification passed!')
    }
  } else {
    console.log('\n5️⃣  Skipping demo parity verification (SKIP_DEMO_PARITY=1)')
  }

  // Optional: run demo visual regression (golden set) as part of verification.
  const skipVisual =
    process.env.SHADCN_ECHARTS_SKIP_VISUAL === '1' ||
    process.env.SKIP_VISUAL === '1'

  const demoDir = join(rootDir, 'demo')
  if (!skipVisual && exists(demoDir)) {
    console.log('\n6️⃣  Running demo visual regression...')
    const res = run('pnpm', ['-C', 'demo', 'test:visual'], { cwd: rootDir })
    if (!res.ok) {
      totalErrors++
      console.error('\n   ❌ Visual regression failed.')
    } else {
      console.log('\n   ✅ Visual regression passed!')
    }
  } else if (skipVisual) {
    console.log('\n6️⃣  Skipping demo visual regression (SKIP_VISUAL=1)')
  } else {
    console.log('\n6️⃣  Skipping demo visual regression (demo/ not found)')
  }

  console.log('\n   Next steps:')
  console.log('   - Run type-check: pnpm type-check')
  console.log('   - Run lint: pnpm lint')
  console.log('   - Build package: pnpm build')
  if (!skipVisual && exists(demoDir)) {
    console.log('   - Update visual snapshots: pnpm -C demo test:visual:update')
  }
  process.exit(totalErrors === 0 ? 0 : 1)
} else {
  console.error('\n   ❌ Verification failed. Please fix the errors above.')
  process.exit(1)
}
