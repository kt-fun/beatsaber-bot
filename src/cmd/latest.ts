import { Context, h, Logger } from 'koishi'
import { Config } from '../config'
import { APIService, RenderService } from '../service'

export function LatestCmd(
  ctx: Context,
  cfg: Config,
  render: RenderService,
  api: APIService,
  logger: Logger
) {
  const log = logger.extend('LatestCmd')
  const latestCmd = ctx
    .command('bsbot.latest')
    .alias('bbnew')
    .alias('bblatest')
    .action(async ({ session, options }, input) => {
      const res = await api.BeatSaver.wrapperResult()
        .withRetry(3)
        .getLatestMaps(3)

      if (!res.isSuccess()) {
        log.info(`fetch new failed, msg: ${res.msg}`)
        session.sendQueued(session.text('commands.bsbot.latest.unknown-error'))
        return
      }
      const text = session.text('commands.bsbot.latest.info')
      const onStartRender = () => {
        session.send(
          session.text('common.render.wait', {
            sec: cfg.rankWaitTimeout / 1000,
          })
        )
      }
      session.sendQuote(text)
      const msgs = res.data.map((item) => ({
        audio: h.audio(item.versions[0].previewURL),
        image: render.renderMap(item, onStartRender),
      }))

      for (const msg of msgs) {
        session.sendQueued(await msg.image)
        session.sendQueued(msg.audio)
      }
    })
  return {
    key: 'latest',
    cmd: latestCmd,
  }
}
