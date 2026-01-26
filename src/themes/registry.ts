/**
 * Theme registration utilities
 * 
 * Registers ECharts themes and provides theme switching functionality
 */

import * as echarts from 'echarts/core'
import type { EChartsType } from 'echarts/core'
import { extractShadcnColors, buildEChartsTheme } from './builder'
import type { ThemeMode } from './types'

/**
 * Register shadcn/ui themes (light and dark)
 * 
 * @param element - Element to read CSS variables from (defaults to document.documentElement)
 */
export function registerShadcnThemes(
  element?: HTMLElement
): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const targetElement = element ?? document.documentElement

  // Register light theme
  const lightColors = extractShadcnColors(targetElement)
  const lightTheme = buildEChartsTheme(lightColors, 'light')
  echarts.registerTheme('shadcn-light', lightTheme)

  // Register dark theme
  // For dark theme, we need to check if dark class exists or use a different element
  const darkElement = targetElement.classList?.contains('dark')
    ? targetElement
    : (targetElement.querySelector('.dark') as HTMLElement | null) ?? targetElement

  const darkColors = extractShadcnColors(darkElement)
  const darkTheme = buildEChartsTheme(darkColors, 'dark')
  echarts.registerTheme('shadcn-dark', darkTheme)
}

/**
 * Get current theme mode based on system preference or DOM
 * 
 * @returns 'light' or 'dark'
 */
export function getThemeMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

  // Check for dark class on html element
  if (document.documentElement.classList.contains('dark')) {
    return 'dark'
  }

  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

/**
 * Get theme name based on current mode
 * 
 * @returns Theme name ('shadcn-light' or 'shadcn-dark')
 */
export function getThemeName(): string {
  const mode = getThemeMode()
  return mode === 'dark' ? 'shadcn-dark' : 'shadcn-light'
}

/**
 * Switch chart theme dynamically
 * 
 * @param chart - ECharts instance
 * @param theme - Theme name or mode
 */
export function switchChartTheme(
  chart: EChartsType | null,
  theme: string | ThemeMode
): void {
  if (!chart) {
    return
  }

  let themeName: string

  if (theme === 'light' || theme === 'dark') {
    themeName = theme === 'dark' ? 'shadcn-dark' : 'shadcn-light'
  } else {
    themeName = theme
  }

  chart.setTheme(themeName)
}

/**
 * Watch for theme changes and update charts
 * 
 * @param charts - Array of ECharts instances to update
 * @returns Cleanup function
 */
export function watchThemeChanges(
  charts: EChartsType[]
): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const observer = new MutationObserver(() => {
    const theme = getThemeName()
    charts.forEach((chart) => {
      if (chart) {
        chart.setTheme(theme)
      }
    })
  })

  const handleChange = () => {
    const theme = getThemeName()
    charts.forEach((chart) => {
      if (chart) {
        chart.setTheme(theme)
      }
    })
  }

  mediaQuery.addEventListener('change', handleChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  return () => {
    mediaQuery.removeEventListener('change', handleChange)
    observer.disconnect()
  }
}
