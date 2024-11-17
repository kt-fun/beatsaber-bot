import { CommandBuilder } from '@/cmd/builder'
import { Platform } from '@/interface'
import { convertDiff } from '@/utils'
import {
  AccountBindingNotFoundError,
  ImageRenderError,
  ScoreNotFoundError,
} from '@/errors'
import { NotFoundError } from '@/utils/fetch/error'
export default () =>
  new CommandBuilder()
    .setName('score') // <uid:text>
    .addOption('p', 'platform:string')
    .addOption('d', 'difficulty:string')
    .addOption('m', 'mode:string')
    .addAlias('bbscore')
    .addAlias('/score')
    .setExecutor(async (c) => {
      let uid = c.session.u.id
      let preference = c.userPreference
      if (c.session.mentions && c.session.mentions.length > 0) {
        uid = c.session.mentions[0].id
        preference = await c.userPreference.getUserPreference(uid)
      }

      const { blAccount, ssAccount } = await c.db.getUserAccountsByUid(uid)
      let account = Platform.BL && blAccount
      account ||= Platform.SS && ssAccount
      if (!account) {
        throw new AccountBindingNotFoundError()
      }

      let diffOption
      if (c.options.d || c.options.m) {
        diffOption = {
          difficulty: convertDiff(c.options.d),
          mode: c.options.m,
        }
      }
      const mapId = c.input
      const score = await c.api.BeatLeader.getScoreByPlayerIdAndMapId(
        account.platformUid,
        mapId,
        diffOption
      ).catch((e) => {
        if (e instanceof NotFoundError) {
          throw new ScoreNotFoundError({
            user: account.platformUname,
            id: mapId,
            diff: diffOption?.difficulty,
            mode: c.options.m,
          })
        }
        throw e
      })
      const platform = c.options.p == 'ss' ? Platform.SS : Platform.BL
      const img = await c.render.renderScore(
        score.id?.toString(),
        platform,
        preference
      )
      await c.session.sendImgBuffer(img)
    })
