import {CommandBuilder} from "@/interface";
import { parsePlatform, Platform } from '@/utils'
import {UnknownUserIDError} from "@/services/errors";

export default () =>
  new CommandBuilder()
    .setName('rank')
    .addOption('p', 'platform:string')
    .setExecutor(async (c) => {
      let uid = c.session.user.id
      if (c.session.mentions && c.session.mentions.length > 0) {
        uid = c.session.mentions[0].id
      }
      const { blAccount, ssAccount } = await c.services.db.getUserAccountsByUid(uid)
      let accountId = Platform.BL && blAccount?.accountId

      if (c.input) {
        accountId = c.input
        // preference = undefined
      } else if (!accountId) {
        accountId = Platform.SS && ssAccount?.accountId
      }

      if (!accountId && !c.input) {
        throw new UnknownUserIDError()
      }
      const rankPlatform = parsePlatform(c.options.p)
      const img = await c.services.render.renderRank(accountId, rankPlatform)
      await c.session.sendImgBuffer(img)
    })

