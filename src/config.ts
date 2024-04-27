import { Schema } from 'koishi'

export interface Config {
  beatSaverHost: string,
  beatSaverWSURL: string,
  rankRenderURL: string,
  minRawMatchMapIdLength: number,
  defaultWaitTimeout: number,
  renderMode: 'local'| 'screenshot'
}

export const Config =Schema.object({
  beatSaverHost: Schema.string().default('https://api.beatsaver.com'),
  beatSaverWSHost: Schema.string().default('wss://ws.beatsaver.com/maps'),
  rankRenderURL: Schema.string().default('https://bs-rank-render.vercel.app'),
  rawMatchMapIdLength: Schema.number().default(3),
  renderMode: Schema.string().default('local'),
  defaultWaitTimeout: Schema.number().default(3000),
})
  .i18n({
  'zh-CN': require('./locales/zh-CN')._config,
  'en-US': require('./locales/en-US')._config,
})
