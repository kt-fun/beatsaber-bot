import {BeatLeaderClient, BeatSaverClient} from "./api";
import {wrapperErr} from "./utils/handlerError";

export const BeatSaverService = (
  bsClient:BeatSaverClient,
)=>{
  return {
    getUnreadAlertsByPage: (ak:string,page:number)=> wrapperErr(()=>bsClient.getUnreadAlertsByPage(ak,page)),
    getTokenInfo: (ak:string) => wrapperErr(()=>bsClient.getTokenInfo(ak)),
    searchMapById: (key:string) => wrapperErr(()=> bsClient.searchMapById(key)),
    searchMapByKeyword: (key:string) => wrapperErr(()=> bsClient.searchMapByKeyword(key)),
    getLatestMaps: (pageSize: number)=> wrapperErr(()=> bsClient.getLatestMaps(pageSize)),
    getBSMapperById: (id: string) => wrapperErr(()=> bsClient.getBSMapperById(id)),
    refreshOAuthToken: (rk: string) => wrapperErr(()=> bsClient.refreshOAuthToken(rk)),
  }
}
