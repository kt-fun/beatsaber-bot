import { $, Context, h, Logger } from 'koishi'
import { Config } from '../config'
import { BeatSaverWSEvent } from '../types'
import { RenderService } from '../service'

export function BeatSaverWS(
  ctx: Context,
  config: Config,
  render: RenderService,
  logger: Logger
) {
  const ws = ctx.http.ws(
    config.beatSaverWSURL ?? 'wss://ws.beatsaver.com/maps'
  ) as any
  ws.on('open', (evt) => {
    logger.info('BeatsaverWS opened')
  })
  ws.on('message', async (event) => {
    // const data = MockBeatsaverWsEvent
    const data = JSON.parse(event.toString()) as BeatSaverWSEvent
    logger.info('Beatsaver message received', data.type, data?.msg?.id)
    if (data.type == 'MAP_UPDATE') {
      const bsmap = data.msg
      if (!bsmap.versions.some((it) => it.state == 'Published')) {
        return
      }
      // if(bsmap.declaredAi != "None") {
      //   return
      // }
      const userId = bsmap.uploader.id
      const selection = ctx.database.join([
        'BSBotSubscribe',
        'BSRelateOAuthAccount',
        'BSSubscribeMember',
        'user',
      ])
      const subscribe = await selection
        .where((row) =>
          $.and(
            $.eq(row.BSBotSubscribe.enable, true),
            $.eq(row.BSBotSubscribe.id, row.BSSubscribeMember.subscribeId),
            $.eq(row.BSBotSubscribe.type, 'beatsaver'),
            $.eq(row.BSRelateOAuthAccount.platform, 'beatsaver'),
            $.eq(row.user.id, row.BSRelateOAuthAccount.uid),
            $.eq(row.user.id, row.BSSubscribeMember.memberUid),
            $.eq(row.BSRelateOAuthAccount.platformUid, userId.toString())
          )
        )
        .execute()

      const subscription = subscribe.map((item) => ({
        account: item.BSRelateOAuthAccount,
        subscribe: item.BSBotSubscribe,
        member: item.BSSubscribeMember,
        user: item.user,
      }))
      for (const item of subscription) {
        logger.info('send msg to', item.subscribe)
        const bot =
          ctx.bots[`${item.subscribe.platform}:${item.subscribe.selfId}`]
        if (!bot) {
          continue
        }
        let texts = []
        const res = await ctx.database.get('binding', {
          platform: item.subscribe.platform,
          aid: item.member.memberUid,
        })
        if (res.length > 0) {
          logger.info('mapperId in platform', res[0].platform)
          texts = [
            `本群谱师`,
            h.at(res[0].pid),
            ` 刚刚发布了新谱面，「${bsmap.name}」`,
          ]
        } else {
          texts = [
            `谱师「${bsmap.uploader.name}」刚刚发布了新谱面，「${bsmap.name}」`,
          ]
        }
        const image = render.renderMap(bsmap)
        await bot.sendMessage(item.subscribe.channelId, h('message', texts))
        await bot.sendMessage(item.subscribe.channelId, await image)
        await bot.sendMessage(
          item.subscribe.channelId,
          h.audio(bsmap.versions[0].previewURL)
        )
      }
    }
  })
  ws.addEventListener('close', (evt) => {
    logger.info('BeatsaverWS closed')
  })
  return ws
}
