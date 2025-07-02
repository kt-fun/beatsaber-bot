import { CommandBuilder } from "@/interface/cmd/builder"

export default () =>
  new CommandBuilder()
    .setName('latest')
    .addAlias('bbnew')
    .addAlias('blnew')
    .addAlias('ssnew')
    .addAlias('bsnew')
    .addAlias('/blnew')
    .addAlias('/ssnew')
    .addAlias('/bsnew')
    .setDescription('get latest 3 beatmap')
    .setExecutor(async (c) => {
      const res = await c.services.api.BeatSaver.getLatestMaps(3)
      const text = c.session.text('commands.bsbot.latest.info')
      await c.session.sendQuote(text)
      const msgs = res.map((item) => ({
        audio: item.versions[0].previewURL,
        image: c.services.render.renderMap(item),
      }))
      for (const msg of msgs) {
        await c.session.sendImgBuffer(await msg.image)
        await c.session.sendAudioByUrl(msg.audio)
      }
    })
