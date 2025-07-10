import {EventContext} from "@/interface";
import {BeatLeaderWSEvent} from "@/services/api/interfaces/beatleader";


export const BeatleaderScore = async (c: EventContext<BeatLeaderWSEvent>) => {
  const data = c.data
  const playerId = data.player.id
  // const ok = BeatLeaderFilter(data, ...this.config.BLScoreFilters)
  // if (!ok) {
  //   return
  // }
  // logger.info('Received beatleader message',data.id, data.player.id);
  // cache all playerId
  const subscriptions = await c.services.db.getAllSubscriptionByUIDAndPlatform(playerId, 'beatleader')
  // .filter(item=> {
  //   const channelFilters = item.sub.data as BLScoreFilter[]
  //   const memberFilters = item.member.subscribeData
  //   return BeatLeaderFilter(data, ...channelFilters, ...memberFilters)
  // })
  const restSub = subscriptions.filter((it) =>
    it.subscription.type == 'beatleader-score' && it.subscription.enabled == true
  )
  // cacheService
  if (restSub.length === 0) return
  const img = await c.services.render.renderScore(data.id.toString())
  for (const item of restSub) {
    const session = await c.agentService.getAgentSessionByChannelInfo(item.channel)
    if (!session) {
      continue
    }
    await session.send(
      `恭喜 <at id="${item.account.userId}"/> 刚刚在谱面「${data.leaderboard.song.name}」中打出了 ${(data.accuracy * 100).toFixed(2)}% 的好成绩`
    )
    await session.sendImgBuffer(img)
  }
}
