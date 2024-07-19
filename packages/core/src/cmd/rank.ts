import { CommandBuilder } from '@/cmd/builder'
import { Platform } from '@/interface'

export default () =>
  new CommandBuilder()
    .setName('rank')
    .addOption('p', 'platform:string')
    .setDescription('clear an auth account relate info')
    .addAlias('bbrank')
    .addAlias('/ssrank', { options: { p: 'ss' } })
    .addAlias('/blrank', { options: { p: 'bl' } })
    .addAlias('bbrankss', { options: { p: 'ss' } })
    .addAlias('bbrankbl', { options: { p: 'bl' } })
    .addAlias('ssrank', { options: { p: 'ss' } })
    .addAlias('blrank', { options: { p: 'bl' } })
    .addAlias('!rankss', { options: { p: 'ss' } })
    .addAlias('!rankbl', { options: { p: 'bl' } })
    .addAlias('irankss', { options: { p: 'ss' } })
    .addAlias('irankbl', { options: { p: 'bl' } })
    .setExecutor(async (c) => {
      const platform = c.options.p == 'ss' ? Platform.SS : Platform.BL
      const uid = c.session.mentions?.[0].id || c.session.u.id
      if (!uid) {
        c.session.sendQuote(c.session.text('commands.bsbot.who.need-at'))
        return
      }
      const { blAccount, ssAccount } = await c.db.getUserAccountsByUid(uid)
      let accountId = Platform.BL && blAccount.platformUid
      accountId ||= Platform.SS && ssAccount.platformUid
      if (!accountId) {
        c.session.sendQuote(c.session.text('commands.bsbot.who.not-found'))
        return
      }
      const onStartRender = () => {
        c.session.send(
          c.session.text('common.render.wait', {
            sec: c.config.rankWaitTimeout / 1000,
          })
        )
      }
      const img = await c.render.renderRank(c.input, platform)
      c.session.sendQueued(img)
    })
