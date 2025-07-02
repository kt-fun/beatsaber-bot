import type { S3Config, RenderConfig } from "@/infra";


export interface Config {
  s3: {
    enabled: boolean
  } & S3Config
  render: RenderConfig
  minRawMatchMapIdLength: number

  beatSaverHost: string
  beatSaverWSURL: string
  bsOauthClientId: string
  bsOauthClientSecret: string

  blOauthClientId: string
  blOauthClientSecret: string
  bsNotifyMonitorCron: ScheduleTaskConfig
  tokenRefreshCron: ScheduleTaskConfig
  tempCron: ScheduleTaskConfig
}

interface ScheduleTaskConfig {
  cron: string
  enabled: boolean
}
