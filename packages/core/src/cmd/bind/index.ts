import { handleScoreSaberBind } from './bind-id-scoresaber'
import {availablePlatforms, parsePlatform, Platform} from '@/utils'
import { handleBeatLeaderIDBind } from '@/cmd/bind/bind-id-beatleader'
import { handleBeatSaverIDBind } from '@/cmd/bind/bind-id-beatsaver'
import {CommandBuilder} from "@/interface";


// 目前的绑定支持是很简单的通过 ID 进行绑定，没有任何验证机制
// 因此未对多个用户绑定同一个 ID 多情况进行限制。
// 一个用户目前一个平台只能绑定一个 id
export default () =>
  new CommandBuilder()
    .setName('bind')
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
    .setDescription('bind beatsaver account(beatsaver, beatleader, scoresaber)')
    .setExecutor(async (c) => {
      let platform: Platform
      if (!c.options.p || availablePlatforms.includes(c.options.p)) {
        platform = parsePlatform(c.options.p, Platform.BL)
      } else {
        await c.session.sendQuote(c.session.text('commands.bsbot.bind.unsupported-platform', {
          params: {
            platform: c.options.p
          }
        }))
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
