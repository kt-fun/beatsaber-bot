import { Config } from '@/config'
import { LBScoreMonitor } from './temp'


export const getScheduleTasks = (config: Config) => {
  return [
    {
      name: 'lb-rank-notifier',
      handler: LBScoreMonitor,
      cron: config.tempCron.cron,
      enabled: config.tempCron.enabled,
    },
  ]
}
