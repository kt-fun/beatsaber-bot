import { CmdContext } from '@/interface'
import { handleIdBinding, PlatformBindingServices } from './common'

export const handleBeatSaverIDBind = async (c: CmdContext) => {
  const services: PlatformBindingServices = {
    fetchUser: (id) => c.services.api.BeatSaver.getBSMapperById(id)
      .then(res => ({id: String(res.id), name: res.name}))
      .catch(err => null),
    getExistingAccount: async (userId) => {
      const { bsAccount } = await c.services.db.getUserAccountsByUid(userId)
      return bsAccount
    },
    platformName: 'bs',
    providerId: 'beatsaver',
  }
  await handleIdBinding(c, services)
}
