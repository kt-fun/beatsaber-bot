import {Context} from "koishi";
import {Config} from "../config";
import {BSErrorResponse, BSMap, BSMapLatestResponse, BSUserResponse} from "../types";

export const bsRequest =(ctx:Context,cfg:Config)=> {
  const http = ctx.http
  let host = cfg.beatSaverHost ?? "https://api.beatsaver.com"
  if(host.endsWith("/")) {
    host = host.substring(0,host.length-1)
  }

  const wrapperErr = async<T>(block:()=>T) => {
    try {
      return await block()
    }catch (e) {
      console.log(e)
      return null
    }
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
  // zod kind valid
  return {
    getBSMapperById,
    getLatestMaps,
    searchMapByKeyword,
    searchMapById
  }
}
