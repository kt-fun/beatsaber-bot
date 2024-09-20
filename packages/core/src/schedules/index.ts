import { tokenRefreshTask } from './oauthTokenRefreshTask'
import { ScheduleTask } from '@/schedules/interface'
import { Config } from '@/config'

const oauthTokenRefreshTask = {
  name: 'oauthTokenRefreshTask',
  // config
  cron: '',
  executor: tokenRefreshTask,
}

export const getScheduleTasks = (config: Config) => {
  // oauthTokenRefreshTask
  return [] as ScheduleTask[]
}
