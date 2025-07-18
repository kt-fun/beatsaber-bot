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
  const cacheKey = `events.beatsaver.bsmap.${msg.msg.id}.${msg.type}`
  if(c.services.cache.get(cacheKey)) {
    return
  }
  const bsmap = msg.msg
  c.services.cache.set(cacheKey, true)
  const userId = bsmap.uploader.id
  const eventTargets = await c.services.db.getBSMapEventTargets(String(userId))
  const image = await c.services.render.renderMap(bsmap)
  for (const item of eventTargets) {
    const session = await c.agentService.getAgentSessionByChannelInfo(item.channel)
    if (!session) {
      c.logger.warn('session not found, event target skipped: ', JSON.stringify(item, null))
      continue
    }
    await session.send(
      session.text(`events.beatsaver.bsmap.update`, {
        mapId: bsmap.id,
        mapName: bsmap.name,
        mapperName: bsmap.uploader.name
      })
    )
    await session.sendImgBuffer(image)
    await session.sendAudioByUrl(bsmap.versions[0].previewURL)
  }

}
