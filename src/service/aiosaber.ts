import {AIOSaberClient} from "./api";


const AIOSaberService = (
  aioClient:AIOSaberClient
)=>{

  return {
    ...aioClient
  }
}

export {
  AIOSaberService
}
