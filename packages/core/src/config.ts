export interface BSAbility {
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
  beatSaverHost: string
  beatSaverWSURL: string
  remoteRenderURL: string
  minRawMatchMapIdLength: number
  defaultWaitTimeout: number
  rankWaitTimeout: number
  renderMode: 'local' | 'remote'
  bsOauthClientId: string
  bsOauthClientSecret: string
  blOauthClientId: string
  blOauthClientSecret: string
  // todo: notify
  bsNotifyMonitorCron: string
  tokenRefreshCron: string
  tempCron: string
  BLScoreFilters: any
}
