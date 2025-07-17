export enum Platform {
  SS = 'scoresaber',
  BS = 'beatsaver',
  BL = 'beatleader',
}

export const availablePlatforms = [
  'ss', 'scoresaber',
  'bl', 'beatleader',
  'bs', 'beatsaver'
]
export const parsePlatform = (p: string, defaultPlatform?: Platform) => {
  switch (p) {
    case 'scoresaber':
    case 'ss':
      return Platform.SS
    case 'beatleader':
    case 'bl':
      return Platform.BL
    case 'beatsaver':
    case 'bs':
      return Platform.BS
  }
  return defaultPlatform ?? null
}
