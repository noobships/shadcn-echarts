import * as echarts from 'echarts/core'

// Minimal GeoJSON for demo purposes
const worldMapGeoJson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Region A' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Region B' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[10, 0], [20, 0], [20, 10], [10, 10], [10, 0]]],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Region C' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[0, 10], [10, 10], [10, 20], [0, 20], [0, 10]]],
      },
    },
  ],
}

export function registerMapData(): void {
  if (typeof window === 'undefined') {
    return
  }
  try {
    echarts.registerMap('world', worldMapGeoJson as any)
  } catch (error) {
    console.warn('Map registration warning:', error)
  }
}
