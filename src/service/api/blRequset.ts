import {Context} from "koishi";
import {BeatLeaderPlayerScoreRequest, Leaderboard, Score} from "../../types/beatleader";
import {Config} from "../../config";
import {wrapperErr} from "../utils/handlerError";


export const blRequest =(ctx:Context, cfg:Config)=> {
  const http = ctx.http
  let host =  "https://api.beatleader.xyz"
  if(host.endsWith("/")) {
    host = host.substring(0,host.length-1)
  }

  const url = (path:string)=> {
    if(!path.startsWith("/")) {
      path = "/" + path
    }
    return host+path
  }
  const getPlayerScore = async (req:BeatLeaderPlayerScoreRequest):Promise<Leaderboard> =>
    wrapperErr(async ()=>{
      return  (await http.get(url(`/score/${req.leaderboardContext}/${req.playerID}/${req.hash}/${req.diff}/${req.mode}`))) as Leaderboard
    })

  return {
    getPlayerScore,
  }
}
