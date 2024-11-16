export interface BSAbility {
  // need bs oauth token
  bsNotify: {
    enabled: boolean
    MonitorCron: string
  }
  // should use rank notify
  // rankNotify: {
  //   enabled: boolean;
  //   MonitorCron: string;
  // }
}

export interface Config {
  preferPuppeteerMode: 'local-plugin' | 'remote'
  broswerlessWSEndpoint: string
  uploadImageToS3: {
    enable: boolean
    s3AccessKey: string
    s3SecretKey: string
    endpoint: string
    region: string | undefined
    bucketName: string
    keyPrefix: string
    baseURL: string
  }
  renderMode: 'local' | 'remote'
  beatSaverHost: string
  beatSaverWSURL: string
  remoteRenderURL: string
  minRawMatchMapIdLength: number
  defaultWaitTimeout: number
  rankWaitTimeout: number
  bsOauthClientId: string
  bsOauthClientSecret: string
  blOauthClientId: string
  blOauthClientSecret: string
  // todo: notify
  bsNotifyMonitorCron: ScheduleTaskConfig
  tokenRefreshCron: ScheduleTaskConfig
  tempCron: ScheduleTaskConfig
  BLScoreFilters: any
}
interface ScheduleTaskConfig {
  cron: string
  enable: boolean
}
