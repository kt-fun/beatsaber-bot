import { tokenRefreshTask } from './oauthTokenRefreshTask'
import { Config } from '@/config'
import { LBScoreMonitor } from '@/schedules/temp'

const oauthTokenRefreshTask = {
  name: 'oauthTokenRefreshTask',
  // config
  cron: '',
  executor: tokenRefreshTask,
}

export const getScheduleTasks = (config: Config) => {
  return [
    {
      name: 'lb-rank-notifier',
      handler: LBScoreMonitor,
      cron: config.tempCron.cron,
      enable: config.tempCron.enable,
    },
  ]
}
