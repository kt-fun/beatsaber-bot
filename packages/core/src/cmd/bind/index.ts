import { handleScoreSaberBind } from './bind-scoresaber'
import { CommandBuilder } from '@/cmd/builder'
import { Platform } from '@/interface'
import { handleBeatLeaderBind } from '@/cmd/bind/bind-beatleader'
import { handleBeatSaverBind } from '@/cmd/bind/bind-beatsaver'
import { handleBeatLeaderIDBind } from '@/cmd/bind/bind-id-beatleader'
import { handleBeatSaverIDBind } from '@/cmd/bind/bind-id-beatsaver'

export default () =>
  new CommandBuilder()
    .setName('bind')
    // <scoresaberId:string>
    .addOption('p', 'platform:string')
    .addAlias('bbbind')
    .addAlias('bindbs', { options: { p: 'bs' } })
    .addAlias('bindbl', { options: { p: 'bl' } })
    .addAlias('bindss', { options: { p: 'ss' } })
    .addAlias('bbbindbs', { options: { p: 'bs' } })
    .addAlias('bbbindbl', { options: { p: 'bl' } })
    .addAlias('bbbindss', { options: { p: 'ss' } })
    .addAlias('ssbind', { options: { p: 'ss' } })
    .addAlias('blbind', { options: { p: 'bl' } })
    .addAlias('bsbind', { options: { p: 'bs' } })
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
          await handleBeatSaverIDBind(c)
          break
        case Platform.BL:
          await handleBeatLeaderIDBind(c)
          break
        default:
          throw Error('unreachable code line')
      }
    })
