import { Context } from 'koishi'

import { Config } from 'beatsaber-bot-core'
import {koishiAdapter} from "@/adatper";
export * from './config'
import {} from 'koishi-plugin-cron'

export const name = 'beatsaber-bot'

export const inject = {
  optional: ['assets', 'puppeteer'],
  required: ['database', 'cron'],
}

export function apply(ctx: Context, config: Config) {
  return koishiAdapter(ctx, config)
}
