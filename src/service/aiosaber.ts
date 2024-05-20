import {AIOSaberClient} from "./api";
import {wrapperErr} from "./utils/handlerError";


const AIOSaberService = (
  aioClient:AIOSaberClient
)=>{

  return {
    getBSOAuthToken: (key:string)=> wrapperErr(()=>aioClient.getBSOAuthToken(key)),
    getBLOAuthToken: (key:string)=> wrapperErr(()=>aioClient.getBLOAuthToken(key)),
  }
}

export {
  AIOSaberService
}
