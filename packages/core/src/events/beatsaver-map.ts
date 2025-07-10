import {EventContext} from "@/interface";
import {BSMap} from "@/services/api/interfaces/beatsaver";


type DeleteMsg = { type: 'MAP_DELETE', msg: string }
type UpdateMsg = { type: 'MAP_UPDATE', msg: BSMap }
type BSMapEvent =  DeleteMsg | UpdateMsg

export const BeatsaverMap = async (c: EventContext<BSMapEvent>) => {
  const msg = c.data as BSMapEvent
  if (!(msg.type === 'MAP_UPDATE' && msg.msg.versions.some((it) => it.state == 'Published') && msg.msg.declaredAi === 'None')) {
    return
  }
  const cacheKey = `ws.bs.${msg.msg.id}.${msg.type}`
  if(c.services.cache.get(cacheKey)) {
    return
  }
  const bsmap = msg.msg
  c.services.cache.set(cacheKey, true)
  const userId = bsmap.uploader.id
  const subscriptions = await c.services.db.getAllSubscriptionByUIDAndPlatform(
    String(userId),
    'beatsaver'
  )
  const restSub = subscriptions.filter(
    (it) =>
      it.subscription.type == 'beatsaver-map' && it.subscription.enabled == true
  )
  const gids = restSub.map((it) => it.channel.id)
  const groupSubs = await c.services.db.getIDSubscriptionByType('id-beatsaver-map')
  const restGroupSubs = groupSubs.filter(
    (it) =>
      !gids.includes(it.channel.id) &&
      it.subscription.data?.mapperId?.toString() === userId.toString()
  )

  // cacheService
  if (restSub.length === 0 && restGroupSubs) return
  const image = c.services.render.renderMap(bsmap)
  for (const item of restSub) {
    const session = await c.agentService.getAgentSessionByChannelInfo(item.channel)
    if (!session) {
      continue
    }
    await session.send(
      `本群谱师 「<at id="${item.account.userId}"/> (${bsmap.uploader.name})」刚刚发布了新谱面，「${bsmap.name}」`
    )
    // text + mention element
    await session.sendImgBuffer(await image)
    await session.sendAudioByUrl(bsmap.versions[0].previewURL)
  }
  for (const item of restGroupSubs) {
    const session = await c.agentService.getAgentSessionByChannelInfo(item.channel)
    if (!session) {
      continue
    }
    await session.send(
      `谱师「${bsmap.uploader.name}」刚刚发布了新谱面，「${bsmap.name}」`
    )
    // text + mention element
    await session.sendImgBuffer(await image)
    await session.sendAudioByUrl(bsmap.versions[0].previewURL)
  }
}
