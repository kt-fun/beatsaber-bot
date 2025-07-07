import { Config } from '@/config'
import { LBScoreMonitor } from './temp'

export const getScheduleTasks = (config: Config) => {
  return [
    {
      name: 'lb-rank-notifier',
      handler: LBScoreMonitor,
      cron: config.cron?.temp?.cron,
      enabled: config.cron?.temp?.enabled ?? false,
    },
  ]
}
