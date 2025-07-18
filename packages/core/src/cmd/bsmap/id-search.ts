
import { InvalidParamsError } from '@/services/errors'
import {CommandBuilder} from "@/interface";

const mapIdReg = /^[a-fA-F0-9]{1,6}$/

export const IdSearch = new CommandBuilder()
    .setName('id')
    .addAlias('/id')
    .addAlias('bbid')
    .addAlias('/bbid')
    .addAlias('!bsr')
    .setDescription('search map info by id')
    .setExecutor(async (c) => {
      if (!mapIdReg.test(c.input)) {
        throw new InvalidParamsError({ name: "mapId", expect: 'abefd, 3a667,...', actual: c.input })
      }
      const res = await c.services.api.BeatSaver.searchMapById(c.input)

      const onRenderStart = () => {
        c.session.send(
          c.session.text('common.render.wait', {
            sec: c.config.render.waitTimeout / 1000,
          })
        )
      }

      const image = await c.services.render.renderMap(res, {
        onRenderStart
      })
      await c.session.sendImgBuffer(image)
      await c.session.sendAudioByUrl(res.versions[0].previewURL)
    })
