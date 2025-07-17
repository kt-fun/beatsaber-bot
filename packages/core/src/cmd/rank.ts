import {CommandBuilder} from "@/interface";
import { parsePlatform, Platform } from '@/utils'
import { AccountBindingNotFoundError } from "@/services/errors";

export default () =>
  new CommandBuilder()
    .setName('rank')
    .addOption('p', 'platform:string')
    .setExecutor(async (c) => {
      let uid = c.session.user.id
      let rankPlatform = c.options.p ? parsePlatform(c.options.p) : undefined
      if (c.session.mentions && c.session.mentions.length > 0) {
        uid = c.session.mentions[0].id
      }
      const { blAccount, ssAccount } = await c.services.db.getUserAccountsByUid(uid)
      let accountId: string = c.input
      if(!accountId) {
        switch (rankPlatform) {
          // 明确指明了 rankPlatform
          case Platform.BL:
            accountId = blAccount?.accountId; break
          case Platform.SS:
            accountId = ssAccount?.accountId; break
          default:
            // 在未明确指定平台情况下，自适应
            if(blAccount?.accountId) {
              rankPlatform = Platform.BL
              accountId = blAccount?.accountId
            } else if(ssAccount?.accountId) {
              rankPlatform = Platform.SS
              accountId = ssAccount?.accountId
            }
        }
      }
      if(!rankPlatform) {
        rankPlatform = Platform.BL
      }

      if (!accountId && !c.input) {
        throw new AccountBindingNotFoundError({ platform: rankPlatform, userId: uid })
      }

      const img = await c.services.render.renderRank(accountId, rankPlatform)
      await c.session.sendImgBuffer(img)
    })

