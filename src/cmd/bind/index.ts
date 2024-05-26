import { Context, Logger } from 'koishi'
import { Config } from '../../config'
import { APIService, RenderService } from '../../service'
import { handleScoreSaberBind } from './bind-scoresaber'
import { handleBeatSaverBind } from './bind-beatsaver'
import { handleBeatLeaderBind } from './bind-beatleader'
import { Platform } from '../../types'

export function BindCmd(
  ctx: Context,
  cfg: Config,
  render: RenderService,
  api: APIService,
  logger: Logger
) {
  const bindCmd = ctx
    .command('bsbot.bind <scoresaberId:string>')
    .userFields(['id'])
    .alias('bbbind')
    .alias('bbbindbs', { options: { p: 'bs' } })
    .alias('bbbindbl', { options: { p: 'bl' } })
    .alias('bbbindss', { options: { p: 'ss' } })
    .option('p', '<platform:string>')
    .action(async ({ session, options }, input) => {
      if (!options.p) {
        options.p = 'ss'
      }
      let platform: Platform = Platform.SS
      switch (options.p) {
        case 'bs':
          platform = Platform.BS
          break
        case 'bl':
          platform = Platform.BL
          break
        case 'ss':
          break
        default:
          session.sendQuote(`${options.p} 这还不是一个可以绑定的平台`)
          return
      }
      switch (platform) {
        case Platform.SS:
          await handleScoreSaberBind(ctx, api, { session, options }, input)
          break
        case Platform.BS:
          await handleBeatSaverBind(ctx, api, { session, options }, input)
          break
        case Platform.BL:
          await handleBeatLeaderBind(ctx, api, { session, options }, input)
          break
        default:
          throw Error('unreachable code line')
      }
    })
  return {
    key: 'bind',
    cmd: bindCmd,
  }
}
