import { handleScoreSaberBind } from './bind-scoresaber'
import { CommandBuilder } from '@/cmd/builder'
import { Platform } from '@/interface'
import { handleBeatLeaderBind } from '@/cmd/bind/bind-beatleader'
import { handleBeatSaverBind } from '@/cmd/bind/bind-beatsaver'

export default () =>
  new CommandBuilder()
    .setName('bind')
    // <scoresaberId:string>
    .addOption('p', 'platform:string')
    .addAlias('bbbind')
    .addAlias('bbbindbs', { options: { p: 'bs' } })
    .addAlias('bbbindbl', { options: { p: 'bl' } })
    .addAlias('bbbindss', { options: { p: 'ss' } })
    .setDescription('clear an auth account relate info')
    .setExecutor(async (c) => {
      if (!c.options.p) {
        c.options.p = 'ss'
      }
      let platform: Platform = Platform.SS
      switch (c.options.p) {
        case 'bs':
          platform = Platform.BS
          break
        case 'bl':
          platform = Platform.BL
          break
        case 'ss':
          break
        default:
          c.session.sendQuote(`${c.options.p} 这还不是一个可以绑定的平台`)
          return
      }
      switch (platform) {
        case Platform.SS:
          await handleScoreSaberBind(c)
          break
        case Platform.BS:
          await handleBeatSaverBind(c)
          break
        case Platform.BL:
          await handleBeatLeaderBind(c)
          break
        default:
          throw Error('unreachable code line')
      }
    })
