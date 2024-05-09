import { Schema } from 'koishi'

export interface Config {
  beatSaverHost: string,
  beatSaverWSURL: string,
  remoteRenderURL: string,
  minRawMatchMapIdLength: number,
  defaultWaitTimeout: number,
  rankWaitTimeout: number,
  renderMode: 'local'| 'screenshot',
  bsOauthClientId: string,
  bsOauthClientSecret: string,
  bsNotifyMonitorCron:string,
  tempCron: string,
}

export const Config =Schema.object({
  beatSaverHost: Schema.string().default('https://api.beatsaver.com'),
  beatSaverWSHost: Schema.string().default('wss://ws.beatsaver.com/maps'),
  remoteRenderURL: Schema.string().default('https://aiobs.ktlab.io'),
  minRawMatchMapIdLength: Schema.number().default(3),
  renderMode: Schema.string().default('screenshot'),
  defaultWaitTimeout: Schema.number().default(3000),
  rankWaitTimeout: Schema.number().default(8000),
  bsNotifyMonitorCron: Schema.string().default("*/15 * * * *"),
  bsOauthClientId: Schema.string().default('bs-oauth-client-id'),
  bsOauthClientSecret: Schema.string().default('bs-oauth-client-secret'),
  tempCron: Schema.string().default("0 0 * * *"),
})
  .i18n({
  'zh-CN': require('./locales/zh-CN')._config,
  'en-US': require('./locales/en-US')._config,
})
