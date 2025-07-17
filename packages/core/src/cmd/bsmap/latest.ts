import { CommandBuilder } from "@/interface"
import {InvalidParamsError} from "@/services/errors";

const sizeRegex = /^[1-5]$/

export default () =>
  new CommandBuilder()
    .setName('latest')
    .addAlias('bbnew')
    .addAlias('/blnew')
    .addAlias('/ssnew')
    .addAlias('/bsnew')
    .addOption('s', 'size:number')
    .setDescription('get latest 3 beatmap')
    .setExecutor(async (c) => {
      let s = c.options.s ? parseInt(String(c.options.s)) : 3
      if(!sizeRegex.test(String(s)) || Number.isNaN(s)) {
        throw new InvalidParamsError({
          name: 'size',
          expect: '/^[1-5]$/',
          actual: String(c.options.s)
        })
      }
      let size = s ?? 3
      if(size > 3 || size <= 0) { size = 3 }
      const res = await c.services.api.BeatSaver.getLatestMaps(size)
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
