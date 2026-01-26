/**
 * Theme registration utilities
 * 
 * Registers ECharts themes and provides theme switching functionality
 */

import * as echarts from 'echarts/core'
import type { EChartsType } from 'echarts/core'
import { extractShadcnColors, buildEChartsTheme } from './builder'
import type { ThemeMode, ShadcnChartColors, EChartsTheme } from './types'

/**
 * Register shadcn/ui themes (light and dark)
 * 
 * Registers both light and dark themes by reading CSS variables from the DOM.
 * For dark theme, it temporarily adds the 'dark' class to read dark mode variables.
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
  const hadDarkClass = targetElement.classList.contains('dark')

  // Register light theme
  // Temporarily remove dark class if present to read light theme variables
  if (hadDarkClass) {
    targetElement.classList.remove('dark')
  }
  const lightColors = extractShadcnColors(targetElement)
  const lightTheme = buildEChartsTheme(lightColors, 'light')
  echarts.registerTheme('shadcn-light', lightTheme)

  // Register dark theme
  // Temporarily add dark class to read dark theme variables
  if (!hadDarkClass) {
    targetElement.classList.add('dark')
  }
  const darkColors = extractShadcnColors(targetElement)
  const darkTheme = buildEChartsTheme(darkColors, 'dark')
  echarts.registerTheme('shadcn-dark', darkTheme)

  // Restore original dark class state
  if (hadDarkClass && !targetElement.classList.contains('dark')) {
    targetElement.classList.add('dark')
  } else if (!hadDarkClass && targetElement.classList.contains('dark')) {
    targetElement.classList.remove('dark')
  }
}

/**
 * Get current theme mode based on system preference or DOM
 * 
 * Checks in order:
 * 1. 'dark' class on document.documentElement
 * 2. System preference (prefers-color-scheme: dark)
 * 3. Defaults to 'light'
 * 
 * @param element - Optional element to check (defaults to document.documentElement)
 * @returns 'light' or 'dark'
 */
export function getThemeMode(element?: HTMLElement): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const targetElement = element ?? document.documentElement

  // Check for dark class on html element (highest priority)
  if (targetElement.classList.contains('dark')) {
    return 'dark'
  }

  // Check system preference as fallback
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
 * Watches both DOM class changes and system preference changes.
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

  const updateCharts = () => {
    const theme = getThemeName()
    charts.forEach((chart) => {
      if (chart && !chart.isDisposed()) {
        chart.setTheme(theme)
      }
    })
  }

  // Watch for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleMediaChange = () => {
    updateCharts()
  }

  // Watch for DOM class changes (e.g., when user toggles dark mode)
  const observer = new MutationObserver(() => {
    updateCharts()
  })

  // Set up listeners
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleMediaChange)
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleMediaChange)
  }

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  // Initial update
  updateCharts()

  return () => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', handleMediaChange)
    } else if (mediaQuery.removeListener) {
      // Fallback for older browsers
      mediaQuery.removeListener(handleMediaChange)
    }
    observer.disconnect()
  }
}

/**
 * Register a theme from a color object (useful for SSR or custom themes)
 * 
 * @param colors - ShadcnChartColors object
 * @param mode - Theme mode ('light' or 'dark')
 * @param themeName - Optional custom theme name (defaults to 'shadcn-light' or 'shadcn-dark')
 */
export function registerThemeFromColors(
  colors: ShadcnChartColors,
  mode: ThemeMode,
  themeName?: string
): void {
  const name = themeName ?? (mode === 'dark' ? 'shadcn-dark' : 'shadcn-light')
  const theme = buildEChartsTheme(colors, mode)
  echarts.registerTheme(name, theme)
}

/**
 * Register a theme directly from an ECharts theme object
 * 
 * @param theme - ECharts theme object
 * @param themeName - Theme name to register
 */
export function registerTheme(
  theme: EChartsTheme,
  themeName: string
): void {
  echarts.registerTheme(themeName, theme)
}

/**
 * Get registered theme by name
 * 
 * Note: ECharts doesn't provide a direct API to get registered themes.
 * This is a placeholder for potential future use.
 * For now, themes must be accessed through chart instances.
 * 
 * @param _themeName - Theme name (currently unused, reserved for future implementation)
 * @returns Theme object or undefined if not found
 */
export function getRegisteredTheme(_themeName: string): EChartsTheme | undefined {
  // ECharts doesn't provide a direct API to get registered themes
  // This is a placeholder for potential future use
  // For now, themes must be accessed through chart instances
  return undefined
}
