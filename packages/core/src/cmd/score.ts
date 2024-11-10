import { CommandBuilder } from '@/cmd/builder'
import { Platform } from '@/interface'
import { convertDiff } from '@/utils'
import { AccountBindingNotFoundError, ScoreNotFoundError } from '@/errors'
export default () =>
  new CommandBuilder()
    .setName('score') // <uid:text>
    .addOption('p', 'platform:string')
    .addOption('d', 'difficulty:string')
    .addOption('m', 'mode:string')
    .addAlias('bbscore')
    .addAlias('/score')
    .setExecutor(async (c) => {
      // who? 没有即是自己，有mention 就是 mention
      let uid = c.session.u.id
      if (c.session.mentions && c.session.mentions.length > 0) {
        uid = c.session.mentions[0].id
      }

      const { blAccount, ssAccount } = await c.db.getUserAccountsByUid(uid)
      let accountId = Platform.BL && blAccount?.platformUid
      accountId ||= Platform.SS && ssAccount?.platformUid
      if (!accountId) {
        throw new AccountBindingNotFoundError()
      }

      let diffOption
      if (c.options.d || c.options.m) {
        diffOption = {
          difficulty: convertDiff(c.options.d),
          mode: c.options.m,
        }
      }

      // 从 input 中提取出 mapId
      const mapId = c.input

      const score = await c.api.BeatLeader.getScoreByPlayerIdAndMapId(
        accountId,
        mapId,
        diffOption
      )
      if (!score) {
        throw new ScoreNotFoundError({
          user: accountId,
          id: mapId,
          diff: diffOption?.difficulty,
          mode: c.options.m,
        })
      }

      const platform = c.options.p == 'ss' ? Platform.SS : Platform.BL
      const img = await c.render.renderScore(
        score.id.toString(),
        platform,
        c.userPreference
      )
      await c.session.sendImgBuffer(img)
    })
