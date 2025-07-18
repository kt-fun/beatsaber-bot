import { Schema } from 'koishi'

export const Config = Schema.object({
  s3: Schema.object({
    enabled: Schema.boolean().default(false),
    s3AccessKey: Schema.string().default(''),
    s3SecretKey: Schema.string().default(''),
    bucketName: Schema.string().default(''),
    keyPrefix: Schema.string().default(''),
    baseURL: Schema.string().default(''),
    endpoint: Schema.string().default(''),
    region: Schema.string().default(''),
  }),
  render: Schema.object({
    mode: Schema.string().default('puppeteer'),
    puppeteerURL: Schema.string(),
    cfAccountId: Schema.string(),
    cfAPIKey: Schema.string(),
    defaultWaitTimeout: Schema.number().default(8000),
    rankWaitTimeout: Schema.number().default(8000),
  }),
  beatsaver: Schema.object({
    host: Schema.string().default('https://api.beatsaver.com'),
    wsURL: Schema.string().default('wss://ws.beatsaver.com/maps'),
    oauthClientId: Schema.string(),
    oauthClientSecret: Schema.string(),
  }),
  beatleader: Schema.object({
    oauthClientId: Schema.string(),
    oauthClientSecret: Schema.string(),
  }),
  cron: Schema.object({
    temp: Schema.object({
      enabled: Schema.boolean().default(false),
      cron: Schema.string().default('0 0 * * *'),
    }),
  }),
})
