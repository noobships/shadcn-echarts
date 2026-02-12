declare module 'culori' {
  export type CuloriColor = {
    mode: string
    alpha?: number
    [key: string]: unknown
  }

  export function parse(input: string): CuloriColor | undefined
  export function formatRgb(color: CuloriColor | string): string
  export function formatHex(color: CuloriColor | string): string
}

