import { Context, h, Logger } from 'koishi'
import { Config } from '../config'
import { APIService, RenderService } from '../service'

export function HelpCmd(
  ctx: Context,
  cfg: Config,
  render: RenderService,
  api: APIService,
  logger: Logger
) {
  const helpCmd = ctx
    .command('bsbot.help')
    .alias('bbhelp')
    .alias('!help')
    .action(async ({ session, options }, input) => {
      await session.sendQueued(
        h('image', {
          src: 'https://tmp-r2.ktlab.io/bsbot.basic.v0.1.0.png',
        })
      )
      await session.sendQueued(
        h('image', {
          src: 'https://tmp-r2.ktlab.io/bsbot.sub.v0.1.0.png',
        })
      )
    })

  return {
    key: 'help',
    cmd: helpCmd,
  }
}
