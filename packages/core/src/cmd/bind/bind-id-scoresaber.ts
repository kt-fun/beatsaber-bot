import { CmdContext } from '@/interface'
import { handleIdBinding, PlatformBindingServices } from './common'
import {InvalidParamsError, MissingParamsError} from "@/services/errors";

const playerIdRegex = /^\d+$/
export const handleScoreSaberBind = async (c: CmdContext) => {
  const services: PlatformBindingServices = {
    inputChecker: (i) => {
      if(!c.input) throw new MissingParamsError({ name: 'playerId', example: '1922350521131465' })
      if (!playerIdRegex.test(i)) throw new InvalidParamsError({
        name: 'playerId',
        expect: '1922350521131465',
        actual: c.input
      })
    },
    fetchUser: (id) => c.services.api.ScoreSaber.getScoreUserById(id),
    getExistingAccount: async (userId) => {
      const { ssAccount } = await c.services.db.getUserAccountsByUid(userId)
      return ssAccount
    },
    platformName: 'scoresaber',
    providerId: 'scoresaber',
  }
  await handleIdBinding(c, services)
}
