import { Context, h, Logger } from 'koishi'
import { Config } from '../config'
import { APIService, RenderService } from '../service'
import { convertDiff } from '../utils/converter'
import { getUserBSAccountInfo } from '../service/db/db'
import '../utils/extendedMethod'
import { Platform } from '../types'
export function ScoreCmd(
  ctx: Context,
  cfg: Config,
  render: RenderService,
  api: APIService,
  logger: Logger
) {
  const scoreCmd = ctx
    .command('bsbot.score')
    .alias('bbscore')
    .userFields(['id'])
    .option('p', '<platform:string>')
    .option('d', '<diffculty:string>')
    .option('m', '<mode:string>')
    .action(async ({ session, options }, input) => {
      const platform = options.p == 'ss' ? Platform.SS : Platform.BL
      const reg = /^([0-9a-fA-F]{3,5})(<at id="([0-9a-zA-z_]+)"\/>)?$/
      const onStartRender = () => {
        session.send(
          session.text('common.render.wait', {
            sec: cfg.rankWaitTimeout / 1000,
          })
        )
      }
      if (!reg.test(input)) {
        if (/^[0-9]+$/.test(input)) {
          const img = await render.renderScore(input, platform, onStartRender)
          session.sendQueued(img)
        } else {
          const res = await session.sendQuote(
            session.text('commands.bsbot.score.not-a-score-id')
          )
        }
        return
      }
      const [full, mapId, at, uid, , ...rest] = reg.exec(input)
      let accountId
      if (!uid) {
        const { blAccount } = await getUserBSAccountInfo(ctx, session.user.id)
        if (blAccount) {
          accountId = blAccount.platformUid
        } else {
          session.sendQuote(session.text('commands.bsbot.score.not-bind'))
          return
        }
      } else {
        const res = await ctx.database.get('binding', {
          platform: session.platform,
          pid: uid,
        })
        const userId = res[0]?.aid
        if (userId) {
          const { blAccount } = await getUserBSAccountInfo(ctx, userId)
          if (blAccount) {
            accountId = blAccount.platformUid
          }
        } else {
          session.sendQuote(session.text('commands.bsbot.score.who-not-bind'))
          return
        }
      }

      let diffOption
      if (options.d || options.m) {
        diffOption = {
          difficulty: convertDiff(options.d),
          mode: options.m,
        }
      }
      const score =
        await api.BeatLeader.wrapperResult().getScoreByPlayerIdAndMapId(
          accountId,
          mapId,
          diffOption
        )
      if (!score.isSuccess()) {
        session.sendQuote(
          session.text('commands.bsbot.score.score-not-found', {
            user: accountId,
            id: mapId,
          })
        )
      }
      const img = await render.renderScore(
        score.data.id.toString(),
        platform,
        onStartRender
      )
      session.sendQueued(img)
    })
  return {
    key: 'score',
    cmd: scoreCmd,
  }
}
