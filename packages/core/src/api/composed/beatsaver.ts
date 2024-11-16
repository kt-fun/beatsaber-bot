import { BeatSaverClient } from '../base'

export class BeatSaverService {
  private bsClient: BeatSaverClient
  constructor(bsClient: BeatSaverClient) {
    this.bsClient = bsClient
  }
  // getUnreadAlertsByPage = (ak: string, page: number) =>
  //   this.bsClient.getUnreadAlertsByPage(ak, page)
  getTokenInfo = (ak: string) => this.bsClient.getTokenInfo(ak)
  searchMapById = (key: string) => this.bsClient.searchMapById(key)
  searchMapByKeyword = (key: string) => this.bsClient.searchMapByKeyword(key)
  getLatestMaps = (pageSize: number) => this.bsClient.getLatestMaps(pageSize)
  getBSMapperById = (id: string) => this.bsClient.getBSMapperById(id)
  refreshOAuthToken = (rk: string) => this.bsClient.refreshOAuthToken(rk)
}
