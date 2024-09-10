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
      // who，没有即是自己，有mention 就是mention，有非空 input 就视为 id 查询
      // steamid
      // let accountId = c.input
      // @someone
      let uid = c.session.u.id
      if (c.session.mentions && c.session.mentions.length > 0) {
        uid = c.session.mentions[0].id
      }
      const { blAccount, ssAccount } = await c.db.getUserAccountsByUid(uid)
      let accountId = Platform.BL && blAccount.platformUid
      if (!accountId) {
        accountId = Platform.SS && ssAccount.platformUid
      }

      if (!accountId && !c.input) {
        // c.session.sendQuote(c.session.text('commands.bsbot.me.not-found'))
        throw Error(`Unknown user ID: ${uid}`)
      } else if (!accountId) {
        accountId = c.input
      }
      // const onStartRender = () => {
      //   c.session.send(
      //     c.session.text('common.render.wait', {
      //       sec: c.config.rankWaitTimeout / 1000,
      //     })
      //   )
      // }
      const rankPlatform = c.options.p == 'ss' ? Platform.SS : Platform.BL
      const img = await c.render.renderRank(accountId, rankPlatform)
      await c.session.sendQueued(img)
    })
