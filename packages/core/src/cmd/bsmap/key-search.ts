import { CommandBuilder } from '@/cmd/builder'

interface QueryOption {
  mapper?: string
  q?: string
  sortOrder: string
  automapper?: boolean
  chroma?: boolean
  verified?: boolean
  maxNps?: string
  minNps?: string
  from?: string
  to?: string
  tags?: string
}

export default () =>
  new CommandBuilder()
    .setName('search') // <key:text>
    .addAlias('bbsou')
    .addAlias('bbsearch')
    .addAlias('bbmap')
    .setDescription('clear an auth account relate info')
    .setExecutor(async (c) => {
      let key = c.input
      if (key.length > 15) {
        key = key.slice(0, 15)
        c.session.sendQuote(
          c.session.text('commands.bsbot.search.too-long-key', { key })
        )
      }
      const res = await c.api.BeatSaver.wrapperResult().searchMapByKeyword(key)
      if (!res.isSuccess()) {
        c.session.sendQuote(
          c.session.text('commands.bsbot.search.not-found', { key })
        )
        return
      }
      const onStartRender = () => {
        c.session.send(
          c.session.text('common.render.wait', {
            sec: c.config.rankWaitTimeout / 1000,
          })
        )
      }
      const toBeSend = res.data.slice(0, 3).map((it) => ({
        img: c.render.renderMap(it, onStartRender),
        bsmap: it,
      }))
      const text = c.session.text('commands.bsbot.search.success', {
        key: key,
        length: toBeSend.length,
      })
      await c.session.sendQuote(text)

      // consider merge maps image
      for (const item of toBeSend) {
        await c.session.sendImgBuffer(await item.img)
        await c.session.sendAudioByUrl(item.bsmap.versions[0].previewURL)
      }
    })
