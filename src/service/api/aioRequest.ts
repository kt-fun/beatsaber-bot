import {Context} from "koishi";
import {Config} from "../../config";
import {wrapperErr} from "../utils/handlerError";

export interface AioOauthTokenResponse {
    "access_token": string,
    "token_type": string,
    expires_in: number,
    refresh_token: string,
}
export const aioRequest =(ctx:Context, cfg:Config)=> {
  const http = ctx.http
  let host =  "https://aiobs.ktlab.io"
  if(host.endsWith("/")) {
    host = host.substring(0,host.length-1)
  }

  const url = (path:string)=> {
    if(!path.startsWith("/")) {
      path = "/" + path
    }
    return host+path
  }
  // token
  const getBSOAuthToken = async (key:string):Promise<AioOauthTokenResponse> =>
    wrapperErr(async ()=>{
      return  (await http.get(url(`/api/oauth/beatsaver/token/${key}`)))
    })

  const refreshOAuthToken = async (refreshToken:string):Promise<AioOauthTokenResponse> =>
    wrapperErr(async ()=> {
      const form = new FormData()
      form.append("client_id", cfg.bsOauthClientId)
      form.append("client_secret", cfg.bsOauthClientSecret)
      form.append("grant_type", "refresh_token")
      form.append("refresh_token", refreshToken)
      return fetch("https://beatsaver.com/api/oauth2/token", {
        method: "POST",
        body: form,
      }).then(res => res.json())
    })

  return {
    getBSOAuthToken,
    refreshOAuthToken
  }
}
