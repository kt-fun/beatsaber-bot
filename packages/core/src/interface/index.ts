export * from './db'
export * from './logger'
export * from './bot'
export enum Platform {
  SS = 'scoresaber',
  BS = 'beatsaver',
  BL = 'beatleader',
}

export const parsePlatform = (p: string) => {
  return p == 'ss' ? Platform.SS : Platform.BL
}

export * from './cmd/type'
