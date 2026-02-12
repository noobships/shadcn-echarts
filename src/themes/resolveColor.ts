/**
 * Color resolution utilities
 *
 * Goal: resolve shadcn/ui CSS token values (often `oklch(...)` with alpha)
 * into concrete `rgb(...)` / `rgba(...)` strings that ECharts can consume.
 *
 * Strategy:
 * - Client: use `CSS.supports()` + `getComputedStyle()` for authoritative conversion.
 * - SSR / fallback: use `culori` to parse and format as rgb/rgba.
 */

import { formatRgb, parse } from 'culori'

export interface ResolveColorOptions {
  /**
   * Fallback color when resolution fails.
   *
   * Defaults to opaque black.
   */
  fallback?: string
}

function canUseDOM(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function computeCssColor(value: string): string | null {
  const body = document.body
  if (!body) {
    return null
  }

  const el = document.createElement('div')
  el.style.color = value
  el.style.position = 'absolute'
  el.style.visibility = 'hidden'
  el.style.pointerEvents = 'none'
  el.style.contain = 'strict'
  body.appendChild(el)

  const computed = getComputedStyle(el).color
  body.removeChild(el)

  // Basic sanity check: must be rgb/rgba
  return computed.includes('rgb') ? computed : null
}

/**
 * Resolve an arbitrary CSS color string into `rgb(...)` / `rgba(...)`,
 * preserving alpha when present.
 */
export function resolveColor(value: string, options?: ResolveColorOptions): string {
  const fallback = options?.fallback ?? 'rgba(0, 0, 0, 1)'
  const input = value?.trim?.() ? value.trim() : ''

  if (!input) {
    return fallback
  }

  // Prefer browser conversion when available (handles `oklch`, `color-mix`, etc.)
  if (canUseDOM()) {
    try {
      const supports =
        typeof CSS !== 'undefined' && typeof CSS.supports === 'function'
          ? CSS.supports('color', input)
          : true

      if (supports) {
        const computed = computeCssColor(input)
        if (computed) {
          return computed
        }
      }
    } catch {
      // Fall through to culori
    }
  }

  // SSR / fallback conversion
  try {
    const parsed = parse(input)
    if (parsed) {
      return formatRgb(parsed)
    }
  } catch {
    // ignore
  }

  return fallback
}

