import {Context} from "koishi";
import {Config} from "../../../config";
import {ScoreSaberUser} from "../../../types/scoresaber";
import {ScoreSaberUserResponse} from "../../../img-render/interface/scoresaber";

export const scRequest =(ctx:Context,cfg:Config)=> {
  const http = ctx.http
  let host = "https://scoresaber.com"
  if(host.endsWith("/")) {
    host = host.substring(0,host.length-1)
  }

  const url = (path:string)=> {
    if(!path.startsWith("/")) {
      path = "/" + path
    }
    return host+path
  }

  const getScoreUserById = async (userId:string) => {
    return http.get<ScoreSaberUser>(url(`/api/player/${userId}/full`))
  }

  const getScoreItemsById = (userId:string, page: number, pageSize: number = 8) => {
    return http.get<ScoreSaberUserResponse>(url(`/api/player/${userId}/scores?page=${page}&sort=top&limit=${pageSize}`))
  }

  return {
    getScoreUserById,
    getScoreItemsById
  }
}
