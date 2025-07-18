import { CmdContext } from '@/interface'
import { handleIdBinding, PlatformBindingServices } from './common'
import {InvalidParamsError, MissingParamsError} from "@/services/errors";

const mapperIdRegex = /^\d+$/
export const handleBeatSaverIDBind = async (c: CmdContext) => {
  const services: PlatformBindingServices = {
    inputChecker: (i) => {
      if(!c.input) throw new MissingParamsError({ name: 'mapperId', example: '58338' })
      if (!mapperIdRegex.test(i)) throw new InvalidParamsError({
        name: 'mapperId',
        expect: '58338',
        actual: c.input
      })
    },
    fetchUser: (id) => c.services.api.BeatSaver.getBSMapperById(id)
      .then(res => ({id: String(res.id), name: res.name})),
    getExistingAccount: async (userId) => {
      return c.services.db.getUserAccountsByUserIdAndType(userId, ['beatsaver'] as const)
        .then(res => res.beatsaver)
    },
    platformName: 'beatsaver',
    providerId: 'beatsaver',
  }
  await handleIdBinding(c, services)
}
