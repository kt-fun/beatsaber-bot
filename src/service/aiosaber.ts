import {AIOSaberClient} from "./api";
import {wrapperErr} from "./utils/handlerError";


const AIOSaberService = (
  aioClient:AIOSaberClient
)=>{

  return {
    getBSOAuthToken: (key:string)=> wrapperErr(()=>aioClient.getBSOAuthToken(key))
  }
}

export {
  AIOSaberService
}
