import { CommandBuilder } from '@/cmd/builder'
import { Platform } from '@/interface'

export default () =>
  new CommandBuilder()
    .setName('rank') // <uid:text>
    .addOption('p', 'platform:string')
    .setDescription('clear an auth account relate info')
    .addAlias('bbrank')
    .addAlias('bbrankss', { options: { p: 'ss' } })
    .addAlias('bbrankbl', { options: { p: 'bl' } })
    .addAlias('ssrank', { options: { p: 'ss' } })
    .addAlias('blrank', { options: { p: 'bl' } })
    .addAlias('!rankss', { options: { p: 'ss' } })
    .addAlias('!rankbl', { options: { p: 'bl' } })
    .addAlias('irankss', { options: { p: 'ss' } })
    .addAlias('irankbl', { options: { p: 'bl' } })
    .setExecutor(async (c) => {
      const platform = c.options.p == 'ss' ? Platform.SS : Platform.BL
      const onStartRender = () => {
        c.session.send(
          c.session.text('common.render.wait', {
            sec: c.config.rankWaitTimeout / 1000,
          })
        )
      }
      const img = await c.render.renderRank(c.input, platform)
      c.session.sendQueued(img)
    })
