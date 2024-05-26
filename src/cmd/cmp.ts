import { Context, Logger } from 'koishi'
import { Config } from '../config'
import { APIService, RenderService } from '../service'

export function CmpCmd(
  ctx: Context,
  cfg: Config,
  render: RenderService,
  api: APIService,
  logger: Logger
) {
  const cmpcmd = ctx
    .command('bsbot.cmp')
    .alias('bbcmp')
    .action(async ({ session, options }, input) => {
      // 1. @someone
      // 2. mapId/Hash
      // 3. me
      session.send('still working on')
    })
  return {
    key: 'cmp',
    cmd: cmpcmd,
  }
}
