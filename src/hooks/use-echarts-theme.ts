/**
 * useEChartsTheme hook
 * 
 * Detects system dark mode preference and watches for theme changes
 */

import { useState, useEffect } from 'react'
import { getThemeMode, getThemeName } from '../themes/registry'
import type { ThemeMode } from '../themes/types'

/**
 * Hook to get current ECharts theme
 * 
 * @returns Current theme name and mode
 * 
 * @example
 * ```tsx
 * function MyChart() {
 *   const { theme, mode } = useEChartsTheme()
 *   return <BarChart theme={theme} />
 * }
 * ```
 */
export function useEChartsTheme(): {
  theme: string
  mode: ThemeMode
} {
  const [theme, setTheme] = useState<string>(() => getThemeName())
  const [mode, setMode] = useState<ThemeMode>(() => getThemeMode())

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const updateTheme = () => {
      setMode(getThemeMode())
      setTheme(getThemeName())
    }

    // Watch for class changes on document element
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    // Watch for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      updateTheme()
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return { theme, mode }
}
