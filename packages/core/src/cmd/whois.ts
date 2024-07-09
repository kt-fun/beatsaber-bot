import { CommandBuilder } from '@/cmd/builder'
import { Platform } from '@/interface'

export default () =>
  new CommandBuilder()
    .setName('who')
    .addOption('p', 'platform:string')
    .setDescription('clear an auth account relate info')
    .addAlias('bbwho')
    .addAlias('bbwhoss', { options: { p: 'ss' } })
    .addAlias('bbwhobl', { options: { p: 'bl' } })
    .addAlias('sswho', { options: { p: 'ss' } })
    .addAlias('blwho', { options: { p: 'bl' } })
    .addAlias('!whos', { options: { p: 'ss' } })
    .addAlias('!whob', { options: { p: 'bl' } })
    .addAlias('iwhos', { options: { p: 'ss' } })
    .addAlias('iwhob', { options: { p: 'bl' } })
    .setExecutor(async (c) => {
      const rankPlatform = c.options.p == 'ss' ? Platform.SS : Platform.BL
      const uid = c.session.mentions[0]
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
      const img = await c.render.renderRank(accountId, rankPlatform)
      c.session.sendQueued(img)
    })
