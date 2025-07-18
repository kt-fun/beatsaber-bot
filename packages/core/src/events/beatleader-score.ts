import {EventContext} from "@/interface";
import {BeatLeaderWSEvent} from "@/services/api/interfaces/beatleader";


export const BeatleaderScore = async (c: EventContext<BeatLeaderWSEvent>) => {
  const data = c.data
  const playerId = data.player.id
  if(!data.rank) {
    return
  }
  const eventTargets = await c.services.db.getBLScoreEventTargets(playerId)
  if (eventTargets.length === 0) return
  const img = await c.services.render.renderScore(data.id.toString())
  for (const item of eventTargets) {
    const session = await c.agentService.getAgentSessionByChannelInfo(item.channel)
    if (!session) {
      continue
    }
    await session.send(
      session.text(`events.beatleader.score.update`, {
        username: data.player.name,
        mapId: data.leaderboard.song.id,
        mapName: data.leaderboard.song.name,
        acc: `${(data.accuracy * 100).toFixed(2)}%`,
        pp: data.pp ? `${data.pp} pp` : undefined
      })
    )
    await session.sendImgBuffer(img)
  }
}
