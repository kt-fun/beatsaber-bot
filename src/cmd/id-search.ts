import { Context, h, Logger } from 'koishi'
import { Config } from '../config'
import { APIService, RenderService } from '../service'

export function IdSearchCmd(
  ctx: Context,
  cfg: Config,
  render: RenderService,
  api: APIService,
  logger: Logger
) {
  const searchIdCmd = ctx
    .command('bsbot.id [mapId:string]')
    .alias('bbid')
    .alias('!bsr')
    .shortcut(/(^[0-9a-fA-F]{3,5}$)/, { args: ['$1'] })
    .action(async ({ session, options }, input) => {
      if (!input || (input && input.length < 1)) {
        return
      }
      const reg = /^[a-fA-F0-9]{1,6}$/
      if (!reg.test(input)) {
        session.sendQuote(
          session.text('commands.bsbot.id.error-map-id', { input })
        )
        return
      }
      const res = await api.BeatSaver.wrapperResult().searchMapById(input)
      if (!res.isSuccess()) {
        session.sendQuote(
          session.text('commands.bsbot.id.not-found', { input })
        )
      } else {
        const onStartRender = () => {
          session.send(
            session.text('common.render.wait', {
              sec: cfg.rankWaitTimeout / 1000,
            })
          )
        }
        const image = await render.renderMap(res.data, onStartRender)
        await session.sendQueued(image)
        session.sendQueued(h.audio(res.data.versions[0].previewURL))
      }
    })

  return {
    key: 'id-search',
    cmd: searchIdCmd,
  }
}
