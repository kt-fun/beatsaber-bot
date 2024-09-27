import { CommandBuilder } from '@/cmd/builder'
import { Platform } from '@/interface'
import { convertDiff } from '@/utils'

// todo
//  this is a command for user that need to remove dirty data
export default () =>
  new CommandBuilder()
    // [mapId:string]
    .setName('me')
    .addOption('p', 'platform:string')
    .addOption('d', 'difficulty:string')
    .addOption('m', 'mode:string')
    .setDescription('clear an auth account relate info')
    .addAlias('bbme')
    .addAlias('bbmess', { options: { p: 'ss' } })
    .addAlias('bbmebl', { options: { p: 'bl' } })
    .addAlias('ssme', { options: { p: 'ss' } })
    .addAlias('blme', { options: { p: 'bl' } })
    .addAlias('!ws', { options: { p: 'ss' } })
    .addAlias('!wb', { options: { p: 'bl' } })
    .addAlias('iws', { options: { p: 'ss' } })
    .addAlias('iwb', { options: { p: 'bl' } })
    .addAlias('!wss', { options: { p: 'ss' } })
    .addAlias('!wbl', { options: { p: 'bl' } })
    .addAlias('iwss', { options: { p: 'ss' } })
    .addAlias('iwbl', { options: { p: 'bl' } })
    .setExecutor(async (c) => {
      const rankPlatform = c.options.p == 'ss' ? Platform.SS : Platform.BL
      const { blAccount, ssAccount } = await c.db.getUserAccountsByUid(
        c.session.u.id
      )
      let accountId = Platform.BL && blAccount.platformUid
      accountId ||= Platform.SS && ssAccount.platformUid
      if (!accountId) {
        c.session.sendQuote(c.session.text('commands.bsbot.me.not-found'))
        return
      }

      const onStartRender = () => {
        c.session.send(
          c.session.text('common.render.wait', {
            sec: c.config.rankWaitTimeout / 1000,
          })
        )
      }
      if (c.input && c.input !== '') {
        // todo improve diff opts
        let diffOption
        if (c.options.d || c.options.m) {
          diffOption = {
            difficulty: convertDiff(c.options.d),
            mode: c.options.m,
          }
        }
        const scoreReq =
          await c.api.BeatLeader.wrapperResult().getScoreByPlayerIdAndMapId(
            accountId,
            c.input,
            diffOption
          )
        if (!scoreReq.isSuccess()) {
          c.session.sendQuote(
            c.session.text('commands.bsbot.me.score-not-found', {
              user: accountId,
              id: c.input,
            })
          )
          return
        }
        const img = await c.render.renderScore(
          scoreReq.data.id.toString(),
          rankPlatform
        )
        await c.session.sendImgBuffer(img)
        return
      }
      const img = await c.render.renderRank(accountId, rankPlatform)
      await c.session.sendImgBuffer(img)
    })
