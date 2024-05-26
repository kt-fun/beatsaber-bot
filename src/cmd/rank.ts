import { Context, Logger } from 'koishi'
import { Config } from '../config'
import { APIService, RenderService } from '../service'
import { Platform } from '../types'

export function RankCmd(
  ctx: Context,
  cfg: Config,
  render: RenderService,
  api: APIService,
  logger: Logger
) {
  const rankCmd = ctx
    .command('bsbot.rank <uid:text>')
    .alias('bbrank')
    .alias('bbrankss', { options: { p: 'ss' } })
    .alias('bbrankbl', { options: { p: 'bl' } })
    .alias('ssrank', { options: { p: 'ss' } })
    .alias('blrank', { options: { p: 'bl' } })
    .alias('!rankss', { options: { p: 'ss' } })
    .alias('!rankbl', { options: { p: 'bl' } })
    .alias('irankss', { options: { p: 'ss' } })
    .alias('irankbl', { options: { p: 'bl' } })
    .option('p', '[platform:string]')
    .action(async ({ session, options }, input) => {
      const platform = options.p == 'ss' ? Platform.SS : Platform.BL

      const onStartRender = () => {
        session.send(
          session.text('common.render.wait', {
            sec: cfg.rankWaitTimeout / 1000,
          })
        )
      }
      const img = await render.renderRank(input, platform, onStartRender)
      session.sendQueued(img)
    })
  return {
    key: 'rank',
    cmd: rankCmd,
  }
}
