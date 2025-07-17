import { CmdContext } from '@/interface'
import { subById } from "./common";

export const subscribeBLScore = async (c: CmdContext) => {
  if (!c.input) {
    return
  }
  const type = 'blscore'
  const data = await c.services.api.BeatLeader.getPlayerInfo(c.input)
  const id = `${type}::${c.session.channel.id}::${data.id}`
  const extraData = { playerId: data.id, playerName: data.name }
  return subById(c, id, type, extraData);
}
