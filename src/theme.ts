export interface Theme {
  ghostOpacity: number
  bars: {
    width: number
    gap: number
    maxAmplitude: number
  }
  progressBar: {
    width: number
    color: string
    ghostOpacity: number
  }
  activeColors: {
    topBars: string | string[]
    bottomBars: string | string[]
    background: string
    borders: string
  }
  offColors: {
    topBars: string | string[]
    bottomBars: string | string[]
    background: string
    borders: string
  }
}

export default {
  ghostOpacity: 0.65,
  bars: {
    width: 1,
    gap: 1,
    maxAmplitude: 0.75
  },
  progressBar: {
    width: 1,
    color: '#ea4335',
    ghostOpacity: 0.65
  },
  activeColors: {
    topBars: ['#ea4335', '#ea4335'],
    bottomBars: ['#ea4335', '#ea4335'],
    background: 'transparent',
    borders: 'transparent'
  },
  offColors: {
    topBars: ['#acacac', '#acacac'],
    bottomBars: ['#acacac', '#acacac'],
    background: 'transparent',
    borders: 'transparent'
  }
}
