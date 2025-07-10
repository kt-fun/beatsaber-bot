import { CmdContext } from '@/interface'
import { handleIdBinding, PlatformBindingServices } from './common'

export const handleScoreSaberBind = async (c: CmdContext) => {
  const services: PlatformBindingServices = {
    fetchUser: (id) => c.services.api.ScoreSaber.getScoreUserById(id),
    getExistingAccount: async (userId) => {
      const { ssAccount } = await c.services.db.getUserAccountsByUid(userId)
      return ssAccount
    },
    platformName: 'ss',
    providerId: 'scoresaber',
  }
  await handleIdBinding(c, services)
}