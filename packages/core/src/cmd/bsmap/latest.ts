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
      const res = await c.api.BeatSaver.getLatestMaps(3)
      const text = c.session.text('commands.bsbot.latest.info')
      await c.session.sendQuote(text)
      const msgs = res.map((item) => ({
        audio: item.versions[0].previewURL,
        image: c.render.renderMap(item, c.userPreference),
      }))
      for (const msg of msgs) {
        await c.session.sendImgBuffer(await msg.image)
        await c.session.sendAudioByUrl(msg.audio)
      }
    })
