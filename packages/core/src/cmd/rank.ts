import {CommandBuilder} from "@/interface/cmd/builder";
import { parsePlatform, Platform } from '@/interface'
import {UnknownUserIDError} from "@/infra/errors";

export default () =>
  CommandBuilder.create('rank')
    .addOption('p', 'platform:string')
    .setDescription('clear an auth account relate info')
    .setExecutor(async (c) => {
      // who，没有即是自己，有mention 就是mention，有非空 input 就视为 id 查询
      let uid = c.session.u.id
      // let preference = c.userPreference
      if (c.session.mentions && c.session.mentions.length > 0) {
        uid = c.session.mentions[0].id
        // preference = await c.userPreference.getUserPreference(uid)
      }
      const { blAccount, ssAccount } = await c.services.db.getUserAccountsByUid(uid)
      let accountId = Platform.BL && blAccount?.platformUid

      if (c.input) {
        accountId = c.input
        // preference = undefined
      } else if (!accountId) {
        accountId = Platform.SS && ssAccount?.platformUid
      }

      if (!accountId && !c.input) {
        throw new UnknownUserIDError()
      }
      const rankPlatform = parsePlatform(c.options.p)
      const img = await c.services.render.renderRank(accountId, rankPlatform)
      await c.session.sendImgBuffer(img)
    })

