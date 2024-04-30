import { Schema } from 'koishi'

export interface Config {
  beatSaverHost: string,
  beatSaverWSURL: string,
  rankRenderURL: string,
  minRawMatchMapIdLength: number,
  defaultWaitTimeout: number,
  renderMode: 'local'| 'screenshot',
  notifyMonitorTriggerInterval:number,
  bsOauthClientId: string,
  bsOauthClientSecret: string,
}

export const Config =Schema.object({
  beatSaverHost: Schema.string().default('https://api.beatsaver.com'),
  beatSaverWSHost: Schema.string().default('wss://ws.beatsaver.com/maps'),
  rankRenderURL: Schema.string().default('https://bs-rank-render.ktlab.io'),
  rawMatchMapIdLength: Schema.number().default(3),
  renderMode: Schema.string().default('local'),
  defaultWaitTimeout: Schema.number().default(3000),
  notifyMonitorTriggerInterval: Schema.number().default(900000),
  bsOauthClientId: Schema.string().default('bs-oauth-client-id'),
  bsOauthClientSecret: Schema.string().default('bs-oauth-client-secret'),
})
  .i18n({
  'zh-CN': require('./locales/zh-CN')._config,
  'en-US': require('./locales/en-US')._config,
})
