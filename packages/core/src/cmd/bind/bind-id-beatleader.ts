import { CmdContext } from '@/interface'
import { handleIdBinding, PlatformBindingServices } from './common'
import {InvalidParamsError, MissingParamsError} from "@/services/errors";

const playerIdRegex = /^\d+$/
export const handleBeatLeaderIDBind = async (c: CmdContext) => {
  const services: PlatformBindingServices = {
    inputChecker: (i) => {
      if(! c.input) throw new MissingParamsError({ name: 'playerId', example: '1922350521131465' })
      if (!playerIdRegex.test(i)) throw new InvalidParamsError({
        name: 'playerId',
        expect: '1922350521131465',
        actual: c.input
      })
    },
    fetchUser: (id) => c.services.api.BeatLeader.getPlayerInfo(id),
    getExistingAccount: async (userId) => {
      const res = await c.services.db.getUserAccountsByUserIdAndType(userId, ['beatsaver'] as const)
      return res.beatsaver
    },
    platformName: 'beatleader',
    providerId: 'beatleader',
  }
  await handleIdBinding(c, services)
}
//
