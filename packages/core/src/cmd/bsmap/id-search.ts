
import { InvalidMapIdError, MapIdNotFoundError } from '@/services/errors'
import {CommandBuilder} from "@/interface";
import {NotFoundError} from "@/common/fetch/error";

const mapIdReg = /^[a-fA-F0-9]{1,6}$/

export default () =>
  new CommandBuilder()
    .setName('id')
    .addAlias('/id')
    .addAlias('bbid')
    .addAlias('/bbid')
    .addAlias('!bsr')
    .setDescription('clear an auth account relate info')
    .setExecutor(async (c) => {
      if (!c.input || (c.input && c.input.length < 1)) {
        return
      }
      if (!mapIdReg.test(c.input)) {
        throw new InvalidMapIdError({ input: c.input })
      }
      const res = await c.services.api.BeatSaver.searchMapById(c.input)
        .catch(e => {
          if(e instanceof NotFoundError) {
            throw new MapIdNotFoundError({ mapId: c.input })
          }
          throw e
        })

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
