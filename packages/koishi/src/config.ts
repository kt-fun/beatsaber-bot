import { Schema } from 'koishi'

export const Config = Schema.object({
  beatSaverHost: Schema.string().default('https://api.beatsaver.com'),
  beatSaverWSHost: Schema.string().default('wss://ws.beatsaver.com/maps'),
  remoteRenderURL: Schema.string().default('https://aiobs.ktlab.io'),
  minRawMatchMapIdLength: Schema.number().default(3),
  renderMode: Schema.string().default('remote'),
  defaultWaitTimeout: Schema.number().default(3000),
  rankWaitTimeout: Schema.number().default(8000),
  bsOauthClientId: Schema.string().default('bs-oauth-client-id'),
  bsOauthClientSecret: Schema.string().default('bs-oauth-client-secret'),
  blOauthClientId: Schema.string().default('bl-oauth-client-id'),
  blOauthClientSecret: Schema.string().default('bl-oauth-client-secret'),
  bsNotifyMonitorCron: Schema.object({
    enable: Schema.boolean().default(true),
    cron: Schema.string().default('*/15 * * * *'),
  }),
  tokenRefreshCron: Schema.object({
    enable: Schema.boolean().default(true),
    cron: Schema.string().default('0 20 * * *'),
  }),
  tempCron: Schema.object({
    enable: Schema.boolean().default(false),
    cron: Schema.string().default('0 0 * * *'),
  }),
  BLScoreFilters: Schema.array(
    Schema.object({
      filterName: Schema.string(),
      filterParams: Schema.array(Schema.any()),
    })
  ).default([]),
  preferPuppeteerMode: Schema.string().default('local-plugin'),
  broswerlessWSEndpoint: Schema.string().default(''),
  uploadImageToS3: Schema.object({
    enable: Schema.boolean().default(false),
    s3AccessKey: Schema.string().default(''),
    s3SecretKey: Schema.string().default(''),
    bucketName: Schema.string().default(''),
    keyPrefix: Schema.string().default(''),
    baseURL: Schema.string().default(''),
    endpoint: Schema.string().default(''),
    region: Schema.string().default(''),
  }),
}).i18n({
  // eslint--disable-next-line
  'zh-CN': require('./locales/zh-CN')._config,
  // eslint--disable-next-line
  'en-US': require('./locales/en-US')._config,
})
