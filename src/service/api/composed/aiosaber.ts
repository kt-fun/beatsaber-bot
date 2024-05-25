import {AIOSaberClient} from "../base";

export class AIOSaberService {
  private aioClient: AIOSaberClient;
  constructor(aioClient:AIOSaberClient) {
    this.aioClient = aioClient;
  }

    getBSOAuthToken = (key:string)=> {
      const res = this.aioClient.getBSOAuthToken(key)
      return res
    }
    getBLOAuthToken = (key:string)=> this.aioClient.getBLOAuthToken(key)

}
