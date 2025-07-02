import type {APIService, RenderService} from "@/service";

import type { DB } from "@/interface";
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
export type Services<T> = {
  render: RenderService,
  api: APIService,
  db: DB<T>
}
export * from './cmd/type'
