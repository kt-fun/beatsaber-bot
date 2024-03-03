import {Context} from "koishi";
import {Config} from "../config";
import {BSUserResponse} from "../types";
import {ScoreSaberUser} from "../types/scoresaber";

export const scRequest =(ctx:Context,cfg:Config)=> {
  const http = ctx.http
  let host = "https://scoresaber.com"
  if(host.endsWith("/")) {
    host = host.substring(0,host.length-1)
  }

  const wrapperErr = <T>(block:()=>T) => {
    try {
      const res =  block()
      return res
    }catch (e) {
      return null
    }
  }

  const url = (path:string)=> {
    if(!path.startsWith("/")) {
      path = "/" + path
    }
    return host+path
  }

  const getScoreUserById = async (userId:string):Promise<ScoreSaberUser|null> => {
    return (await http.get(url(`/api/player/${userId}/full`))) as ScoreSaberUser
  }


  return {
    getScoreUserById
  }
}
