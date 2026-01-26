#!/usr/bin/env node

import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { writeFileSync } from 'fs'

const registryDir = 'registry/default'
const items = []

// Read all chart directories
const chartDirs = readdirSync(registryDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)
  .sort()

for (const chartDir of chartDirs) {
  const jsonPath = join(registryDir, chartDir, `${chartDir}.json`)
  try {
    const jsonContent = JSON.parse(readFileSync(jsonPath, 'utf-8'))
    items.push({
      name: jsonContent.name,
      type: jsonContent.type,
      title: jsonContent.title,
      description: jsonContent.description,
      dependencies: jsonContent.dependencies,
      files: jsonContent.files,
    })
  } catch (error) {
    console.error(`Error reading ${jsonPath}:`, error.message)
  }
}

const registryJson = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "shadcn-echarts",
  homepage: "https://github.com/shadcn/echarts",
  items: items,
}

writeFileSync(
  'registry.json',
  JSON.stringify(registryJson, null, 2) + '\n'
)

console.log(`Created registry.json with ${items.length} items`)
