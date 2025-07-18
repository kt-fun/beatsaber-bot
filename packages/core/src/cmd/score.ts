import { CommandBuilder } from "@/interface";
import { Platform, convertDiff } from '@/utils'
import {
  AccountBindingNotFoundError,
  BLScoreNotFoundError,
} from '@/services/errors'
export default () =>
  new CommandBuilder()
    .setName('score')
    .addOption('d', 'difficulty:string')
    .addOption('m', 'mode:string')
    .addAlias('bbscore')
    .addAlias('/score')
    .setExecutor(async (c) => {
      let uid = c.session.user.id
      // let preference = c.userPreference
      if (c.session.mentions && c.session.mentions.length > 0) {
        uid = c.session.mentions[0].id
        // preference = await c.userPreference.getUserPreference(uid)
      }

      const res = await c.services.db.getUserAccountsByUserIdAndType(uid, ['beatleader'] as const)
      let account = Platform.BL && res.beatleader
      if (!account) {
        throw new AccountBindingNotFoundError({ platform: Platform.BL, userId: uid })
      }

      let diffOption
      if (c.options.d || c.options.m) {
        diffOption = {
          difficulty: convertDiff(c.options.d),
          mode: c.options.m,
        }
      }
      const mapId = c.input
      const score = await c.services.api.getScoreByPlayerIdAndMapId(
        account.accountId,
        mapId,
        diffOption
      )
      if(!score) {
        throw new BLScoreNotFoundError({
          username: account.providerUsername,
          mapId: mapId,
          diff: diffOption?.difficulty,
          mode: c.options.m,
        })
      }
      const img = await c.services.render.renderScore(score.id?.toString())
      await c.session.sendImgBuffer(img)
    })
