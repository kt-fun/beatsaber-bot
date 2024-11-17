import { CommandBuilder } from '@/cmd/builder'
import { Platform } from '@/interface'
import { UnknownUserIDError } from '@/errors'

export default () =>
  new CommandBuilder()
    .setName('rank')
    .addOption('p', 'platform:string')
    .setDescription('clear an auth account relate info')
    .addAlias('bbrank')
    .addAlias('/ssrank', { options: { p: 'ss' } })
    .addAlias('/blrank', { options: { p: 'bl' } })
    .addAlias('ssrank', { options: { p: 'ss' } })
    .addAlias('blrank', { options: { p: 'bl' } })
    .addAlias('!rankss', { options: { p: 'ss' } })
    .addAlias('!rankbl', { options: { p: 'bl' } })
    .addAlias('iws', { options: { p: 'ss' } })
    .addAlias('iwb', { options: { p: 'bl' } })
    .addAlias('ssme', { options: { p: 'ss' } })
    .addAlias('blme', { options: { p: 'bl' } })
    .addAlias('irankss', { options: { p: 'ss' } })
    .addAlias('irankbl', { options: { p: 'bl' } })
    .setExecutor(async (c) => {
      // who，没有即是自己，有mention 就是mention，有非空 input 就视为 id 查询
      // steamid
      // let accountId = c.input
      // @someone
      let uid = c.session.u.id
      let preference = c.userPreference
      if (c.session.mentions && c.session.mentions.length > 0) {
        uid = c.session.mentions[0].id
        preference = await c.userPreference.getUserPreference(uid)
      }
      const { blAccount, ssAccount } = await c.db.getUserAccountsByUid(uid)
      let accountId = Platform.BL && blAccount?.platformUid

      if (c.input) {
        accountId = c.input
      } else if (!accountId) {
        accountId = Platform.SS && ssAccount?.platformUid
      }

      if (!accountId && !c.input) {
        throw new UnknownUserIDError()
      }
      const rankPlatform = c.options.p == 'ss' ? Platform.SS : Platform.BL
      const img = await c.render.renderRank(accountId, rankPlatform, preference)
      await c.session.sendImgBuffer(img)
    })
