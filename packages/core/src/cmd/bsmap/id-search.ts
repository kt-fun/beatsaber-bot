import { CommandBuilder } from '@/cmd/builder'

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
      const reg = /^[a-fA-F0-9]{1,6}$/
      if (!reg.test(c.input)) {
        c.session.sendQuote(
          c.session.text('commands.bsbot.id.error-map-id', { input: c.input })
        )
        return
      }
      const res = await c.api.BeatSaver.wrapperResult().searchMapById(c.input)
      if (!res.isSuccess()) {
        c.session.sendQuote(
          c.session.text('commands.bsbot.id.not-found', { input: c.input })
        )
      } else {
        const onStartRender = () => {
          c.session.send(
            c.session.text('common.render.wait', {
              sec: c.config.rankWaitTimeout / 1000,
            })
          )
        }
        const image = await c.render.renderMap(res.data, onStartRender)
        // upload to s3?
        await c.session.send(image)
        c.session.sendAudio(res.data.versions[0].previewURL)
      }
    })
