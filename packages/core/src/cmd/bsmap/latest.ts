import { CommandBuilder } from '@/cmd/builder'

export default () =>
  new CommandBuilder()
    .setName('latest')
    .addAlias('bbnew')
    .addAlias('sslatest')
    .addAlias('bllatest')
    .addAlias('bslatest')
    .addAlias('blnew')
    .addAlias('ssnew')
    .addAlias('bsnew')
    .addAlias('/blnew')
    .addAlias('/ssnew')
    .addAlias('/bsnew')
    .setDescription('clear an auth account relate info')
    .setExecutor(async (c) => {
      const res = await c.api.BeatSaver.wrapperResult()
        .withRetry(3)
        .getLatestMaps(3)

      if (!res.isSuccess()) {
        c.logger.info(`fetch new failed, msg: ${res.msg}`)
        c.session.sendQueued(
          c.session.text('commands.bsbot.latest.unknown-error')
        )
        return
      }
      const text = c.session.text('commands.bsbot.latest.info')
      // const onStartRender = () => {
      //   c.session.send(
      //     c.session.text('common.render.wait', {
      //       sec: c.config.rankWaitTimeout / 1000,
      //     })
      //   )
      // }
      await c.session.sendQuote(text)
      const msgs = res.data.map((item) => ({
        audio: item.versions[0].previewURL,
        image: c.render.renderMap(item, c.userPreference),
      }))
      for (const msg of msgs) {
        await c.session.sendImgBuffer(await msg.image)
        await c.session.sendAudioByUrl(msg.audio)
      }
    })
