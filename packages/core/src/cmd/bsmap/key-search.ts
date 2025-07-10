import {CommandBuilder} from "@/interface";
export default () =>
  new CommandBuilder()
    .setName('search') // <key:text>
    .addAlias('bbsou')
    .addAlias('bbsearch')
    .addAlias('bbmap')
    .setDescription('search beatmap by keyword')
    .setExecutor(async (c) => {
      let key = c.input
      if (key.length > c.config.searchKeyMaxLength) {
        key = key.slice(0, c.config.searchKeyMaxLength)
        c.session.sendQuote(
          c.session.text('commands.bsbot.search.too-long-key', { key })
        )
      }
      const res = await c.services.api.BeatSaver.searchMapByKeyword(key)
      if (res && res.length == 0) {
        await c.session.sendQuote(
          c.session.text('commands.bsbot.search.not-found', { key })
        )
        return
      }
      const onRenderStart = () => {
        c.session.send(c.session.text('common.render.wait', { sec: (c.config.render.waitTimeout) / 1000 }))
      }
      const toBeSend = res.slice(0, 3).map((it) => ({
        img: c.services.render.renderMap(it, {onRenderStart}),
        bsmap: it,
      }))
      const text = c.session.text('commands.bsbot.search.success', {
        key: key,
        length: toBeSend.length,
      })
      await c.session.sendQuote(text)
      for (const item of toBeSend) {
        await c.session.sendImgBuffer(await item.img)
        await c.session.sendAudioByUrl(item.bsmap.versions[0].previewURL)
      }
    })
