import { CommandBuilder } from '@/cmd/builder'
import { InvalidMapIdError, MapIdNotFoundError } from '@/errors'

const mapIdReg = /^[a-fA-F0-9]{1,6}$/

export default () =>
  new CommandBuilder()
    .setName('id') // <mapId:string>
    .addAlias('/id')
    .addAlias('bbid')
    .addAlias('/bbid')
    .addAlias('!bsr')
    // .shortcut(/(^[0-9a-fA-F]{3,5}$)/, { args: ['$1'] })
    .setDescription('clear an auth account relate info')
    .setExecutor(async (c) => {
      if (!c.input || (c.input && c.input.length < 1)) {
        return
      }
      if (!mapIdReg.test(c.input)) {
        throw new InvalidMapIdError({ input: c.input })
      }
      const res = await c.api.BeatSaver.searchMapById(c.input)

      if (!res) {
        throw new MapIdNotFoundError({ input: c.input })
      }

      const onStartRender = () => {
        c.session.send(
          c.session.text('common.render.wait', {
            sec: c.config.rankWaitTimeout / 1000,
          })
        )
      }
      const image = await c.render.renderMap(
        res,
        c.userPreference,
        onStartRender
      )
      await c.session.sendImgBuffer(image)
      await c.session.sendAudioByUrl(res.versions[0].previewURL)
    })
