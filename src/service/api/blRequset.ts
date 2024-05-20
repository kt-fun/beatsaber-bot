import {Context} from "koishi";
import {BeatLeaderPlayerScoreRequest, Leaderboard, Score} from "../../types/beatleader";
import {Config} from "../../config";
import {wrapperErr} from "../utils/handlerError";
import {OAuthTokenInfoResponse, OAuthTokenResponse} from "./bsRequest";


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
  const getPlayerScore = async (req:BeatLeaderPlayerScoreRequest) =>
    http.get<Leaderboard>(url(`/score/${req.leaderboardContext}/${req.playerID}/${req.hash}/${req.diff}/${req.mode}`))

  const getTokenInfo = async (accessToken:string) => {
    return ctx.http.get<OAuthTokenInfoResponse>(url(`/oauth2/identity`), {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  }

  const refreshOAuthToken = async (refreshToken:string) => {
    const form = new URLSearchParams()
    form.append("client_id", cfg.blOauthClientId)
    form.append("client_secret", cfg.blOauthClientSecret)
    form.append("grant_type", "refresh_token")
    form.append("refresh_token", refreshToken)
    const res = await fetch("https://beatsaver.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type":"application/x-www-form-urlencoded"
      },
      body: form,
    }).then(res => res.json() as Promise<OAuthTokenResponse>)
    if(!res.access_token) {
      throw new Error("refreshToken failed")
    }
    return res
  }

  return {
    getPlayerScore,
    getTokenInfo,
    refreshOAuthToken
  }
}
