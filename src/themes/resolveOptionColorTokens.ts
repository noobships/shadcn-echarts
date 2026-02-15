import type { EChartsCoreOption } from 'echarts/core'
import { resolveColor } from './resolveColor'

type AnyRecord = Record<string, unknown>

const COLOR_KEYS = new Set([
  'color',
  'color0',
  'borderColor',
  'borderColor0',
  'textBorderColor',
  'textShadowColor',
  'backgroundColor',
  'areaColor',
  'fillerColor',
  'shadowColor',
])

export interface ResolveOptionColorTokensOptions {
  /**
   * Resolve all supported color strings, not only CSS-token-like values.
   *
   * Defaults to `false` to keep behavior minimally invasive.
   */
  resolveNonTokenColors?: boolean
}

function isPlainObject(value: unknown): value is AnyRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function shouldResolveColor(input: string, resolveNonTokenColors: boolean): boolean {
  if (resolveNonTokenColors) {
    return true
  }

  const normalized = input.toLowerCase()
  return (
    normalized.includes('var(') ||
    normalized.includes('oklch(') ||
    normalized.includes('oklab(') ||
    normalized.includes('color-mix(')
  )
}

function resolveColorString(input: string, resolveNonTokenColors: boolean): string {
  if (!shouldResolveColor(input, resolveNonTokenColors)) {
    return input
  }

  // Keep the original value as fallback so unresolved colors remain untouched.
  return resolveColor(input, { fallback: input })
}

function transformColorValue(value: unknown, resolveNonTokenColors: boolean): unknown {
  if (typeof value === 'string') {
    return resolveColorString(value, resolveNonTokenColors)
  }

  if (Array.isArray(value)) {
    return value.map((item) => transformColorValue(item, resolveNonTokenColors))
  }

  if (!isPlainObject(value)) {
    return value
  }

  const out: AnyRecord = {}
  for (const [key, nested] of Object.entries(value)) {
    if (key === 'colorStops' && Array.isArray(nested)) {
      out[key] = nested.map((stop) => {
        if (!isPlainObject(stop)) {
          return stop
        }
        return {
          ...stop,
          color:
            typeof stop.color === 'string'
              ? resolveColorString(stop.color, resolveNonTokenColors)
              : transformColorValue(stop.color, resolveNonTokenColors),
        }
      })
      continue
    }

    if (COLOR_KEYS.has(key)) {
      out[key] = transformColorValue(nested, resolveNonTokenColors)
      continue
    }

    out[key] = walkNode(nested, resolveNonTokenColors)
  }

  return out
}

function walkNode(node: unknown, resolveNonTokenColors: boolean): unknown {
  if (Array.isArray(node)) {
    return node.map((item) => walkNode(item, resolveNonTokenColors))
  }

  if (!isPlainObject(node)) {
    return node
  }

  const out: AnyRecord = {}
  for (const [key, value] of Object.entries(node)) {
    if (COLOR_KEYS.has(key)) {
      out[key] = transformColorValue(value, resolveNonTokenColors)
      continue
    }
    out[key] = walkNode(value, resolveNonTokenColors)
  }
  return out
}

/**
 * Resolve known color fields in an ECharts option tree.
 *
 * This utility is intentionally opt-in so consumers can choose when to pay the
 * extra processing cost for deeply customized options.
 */
export function resolveOptionColorTokens<T extends EChartsCoreOption>(
  option: T,
  options: ResolveOptionColorTokensOptions = {},
): T {
  const resolveNonTokenColors = options.resolveNonTokenColors ?? false
  return walkNode(option, resolveNonTokenColors) as T
}

