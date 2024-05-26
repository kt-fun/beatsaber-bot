import { Schema } from 'koishi'
import {BLScoreFilter} from "./types";

export interface Config {
  beatSaverHost: string,
  beatSaverWSURL: string,
  remoteRenderURL: string,
  minRawMatchMapIdLength: number,
  defaultWaitTimeout: number,
  rankWaitTimeout: number,
  renderMode: 'local'| 'remote',
  bsOauthClientId: string,
  bsOauthClientSecret: string,
  blOauthClientId: string,
  blOauthClientSecret: string,
  bsNotifyMonitorCron:string,
  tokenRefreshCron: string,
  tempCron: string,
  BLScoreFilters: BLScoreFilter[]
}

export const Config =Schema.object({
  beatSaverHost: Schema.string().default('https://api.beatsaver.com'),
  beatSaverWSHost: Schema.string().default('wss://ws.beatsaver.com/maps'),
  remoteRenderURL: Schema.string().default('https://aiobs.ktlab.io'),
  minRawMatchMapIdLength: Schema.number().default(3),
  renderMode: Schema.string().default('remote'),
  defaultWaitTimeout: Schema.number().default(3000),
  rankWaitTimeout: Schema.number().default(8000),
  bsNotifyMonitorCron: Schema.string().default("*/15 * * * *"),
  tokenRefreshCron: Schema.string().default("0 20 * * *"),
  bsOauthClientId: Schema.string().default('bs-oauth-client-id'),
  bsOauthClientSecret: Schema.string().default('bs-oauth-client-secret'),
  blOauthClientId: Schema.string().default('bl-oauth-client-id'),
  blOauthClientSecret: Schema.string().default('bl-oauth-client-secret'),
  tempCron: Schema.string().default("0 0 * * *"),
  BLScoreFilters: Schema.array(Schema.object({
    filterName: Schema.string(),
    filterParams: Schema.array(Schema.any())
  })).default([])
})
  .i18n({
  'zh-CN': require('./locales/zh-CN')._config,
  'en-US': require('./locales/en-US')._config,
})
