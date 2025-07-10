import { CmdContext } from '@/interface'
import { handleIdBinding, PlatformBindingServices } from './common'

export const handleBeatLeaderIDBind = async (c: CmdContext) => {
  const services: PlatformBindingServices = {
    fetchUser: (id) => c.services.api.BeatLeader.getPlayerInfo(id),
    getExistingAccount: async (userId) => {
      const { blAccount } = await c.services.db.getUserAccountsByUid(userId)
      return blAccount
    },
    platformName: 'bl',
    providerId: 'beatleader',
  }
  await handleIdBinding(c, services)
}