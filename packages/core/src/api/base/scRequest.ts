import { Context } from 'koishi'
import { Config } from '@/config'
import {
  ScoreSaberUser,
  ScoreSaberUserResponse,
} from '../interfaces/scoresaber'

const get = <T>(...args) => fetch(args as any).then((res) => res.json() as T)
export const scRequest = (cfg: Config) => {
  let host = 'https://scoresaber.com'
  if (host.endsWith('/')) {
    host = host.substring(0, host.length - 1)
  }

  const url = (path: string) => {
    if (!path.startsWith('/')) {
      path = '/' + path
    }
    return host + path
  }

  const getScoreUserById = async (userId: string) => {
    return get<ScoreSaberUser>(url(`/api/player/${userId}/full`))
  }

  const getScoreItemsById = (
    userId: string,
    page: number,
    pageSize: number = 8
  ) => {
    return get<ScoreSaberUserResponse>(
      url(
        `/api/player/${userId}/scores?page=${page}&sort=top&limit=${pageSize}`
      )
    )
  }

  return {
    getScoreUserById,
    getScoreItemsById,
  }
}
