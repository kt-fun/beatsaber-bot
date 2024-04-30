import {Context} from "koishi";
import {Config} from "../../config";
import {BSMap, BSMapLatestResponse, BSUserResponse} from "../../types";
import {wrapperErr} from "../utils/handlerError";

//
// interface BeatSaverClient {
//   getBSMapperById: (userId:string) => Promise<BSUserResponse>
//
//
// }

export const bsRequest =(ctx:Context,cfg:Config)=> {
  const http = ctx.http
  let host = cfg.beatSaverHost ?? "https://api.beatsaver.com"
  if(host.endsWith("/")) {
    host = host.substring(0,host.length-1)
  }

  const url = (path:string)=> {
    if(!path.startsWith("/")) {
      path = "/" + path
    }
    return host+path
  }
  const getBSMapperById = async (userId:string):Promise<BSUserResponse> =>
    wrapperErr(async ()=>{
      return  (await http.get(url(`/users/id/${userId}`))) as BSUserResponse
    })

  const getLatestMaps = async (pageSize:number=5):Promise<BSMap[]> =>
    wrapperErr(async ()=>{
      const res = (await http.get(url(`/maps/latest?sort=FIRST_PUBLISHED&pageSize=${pageSize}`))) as BSMapLatestResponse
      return res.docs
    })
  const searchMapByKeyword = async (key:string)=>
    wrapperErr(async ()=>{
      const res = (await http.get(url(`/search/text/0?q=${key}`))) as BSMapLatestResponse
      return res.docs as BSMap[]
    })

  const searchMapById = async (id:string):Promise<BSMap|null> =>
    wrapperErr(async ()=>{
      return (await http.get(url(`/maps/id/${id}`))) as BSMap
    })
  const getAlertsStats = async (accessToken:string):Promise<any|null> =>
    wrapperErr(async ()=>{
      return (await http.get(url(`/alerts/stats`), {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })) as any
    })
  const getAlertsByPage = async (accessToken:string, type: 'unread'|'read',page: number):Promise<any|null> =>
    wrapperErr(async ()=>{

      const headers = {
        Authorization: `Bearer ${accessToken}`
      }

      return (await http.get(url(`/alerts/${type}/${page}`), {
        headers
      })) as any
    })

  const getReadAlertsByPage = async (accessToken:string, page:number):Promise<any|null> => getAlertsByPage(accessToken, 'read',page)
  const getUnreadAlertsByPage = async (accessToken:string, page:number):Promise<any|null> => getAlertsByPage(accessToken, 'unread',page)

  // zod kind valid
  return {
    getBSMapperById,
    getLatestMaps,
    searchMapByKeyword,
    searchMapById,
    getUnreadAlertsByPage,
  }
}
