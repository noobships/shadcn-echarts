/**
 * ChartProvider - global defaults for all Chart instances
 *
 * Wrap your app (or a subtree) in <ChartProvider> to set defaults
 * that every nested Chart inherits. Instance props always win.
 */

'use client'

import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

/**
 * Default values that every Chart in the subtree will inherit.
 *
 * Instance-level props override these defaults.
 */
export interface ChartDefaults {
  /** Apply the built-in shadcn-style minimal defaults preset. */
  preset?: boolean
  /** Theme name ('light', 'dark', or custom). */
  theme?: string
  /** Renderer type ('canvas' or 'svg'). */
  renderer?: 'canvas' | 'svg'
  /** Auto-resize on container changes. */
  autoResize?: boolean
  /** Run entrance animation on first mount. */
  animateOnMount?: boolean
  /** Delay (ms) for mount animation. */
  animateOnMountDelayMs?: number
}

const ChartDefaultsContext = createContext<ChartDefaults>({})

export interface ChartProviderProps extends ChartDefaults {
  children: ReactNode
}

/**
 * Provide default chart props to all nested Chart components.
 *
 * @example
 * ```tsx
 * <ChartProvider animateOnMount={false} renderer="svg">
 *   <BarChart option={barOption} />
 *   <LineChart option={lineOption} />
 * </ChartProvider>
 * ```
 */
export function ChartProvider({ children, ...defaults }: ChartProviderProps): React.JSX.Element {
  return (
    <ChartDefaultsContext.Provider value={defaults}>
      {children}
    </ChartDefaultsContext.Provider>
  )
}

/**
 * Read the current chart defaults from the nearest ChartProvider.
 *
 * Returns an empty object when no provider is present.
 */
export function useChartDefaults(): ChartDefaults {
  return useContext(ChartDefaultsContext)
}
