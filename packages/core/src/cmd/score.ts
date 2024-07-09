import { CommandBuilder } from '@/cmd/builder'
import { Platform } from '@/interface'
import { convertDiff } from '@/utils'
export default () =>
  new CommandBuilder()
    .setName('score') // <uid:text>
    .addOption('p', 'platform:string')
    .addOption('d', 'diffculty:string')
    .addOption('m', 'mode:string')
    .setDescription('clear an auth account relate info')
    .addAlias('bbscore')
    .setExecutor(async (c) => {
      const platform = c.options.p == 'ss' ? Platform.SS : Platform.BL
      const onStartRender = () => {
        c.session.send(
          c.session.text('common.render.wait', {
            sec: c.config.rankWaitTimeout / 1000,
          })
        )
      }
      // give a scoreId? bad
      // if (!reg.test(input)) {
      //   if (/^[0-9]+$/.test(input)) {
      //     const img = await c.render.renderScore(input, platform, onStartRender)
      //     session.sendQueued(img)
      //   } else {
      //     const res = await session.sendQuote(
      //       session.text('commands.bsbot.score.not-a-score-id')
      //     )
      //   }
      //   return
      // }
      const mapId = c.input
      const { blAccount, ssAccount } = await c.db.getUserAccountsByUid(
        c.session.u.id
      )
      let accountId = Platform.BL && blAccount.platformUid
      accountId ||= Platform.SS && ssAccount.platformUid
      if (!accountId) {
        c.session.sendQuote(c.session.text('commands.bsbot.score.not-bind'))
        return
      }

      let diffOption
      if (c.options.d || c.options.m) {
        diffOption = {
          difficulty: convertDiff(c.options.d),
          mode: c.options.m,
        }
      }
      const score =
        await c.api.BeatLeader.wrapperResult().getScoreByPlayerIdAndMapId(
          accountId,
          mapId,
          diffOption
        )
      if (!score.isSuccess()) {
        c.session.sendQuote(
          c.session.text('commands.bsbot.score.score-not-found', {
            user: accountId,
            id: mapId,
          })
        )
      }
      const img = await c.render.renderScore(score.data.id.toString(), platform)
      c.session.sendQueued(img)
    })
