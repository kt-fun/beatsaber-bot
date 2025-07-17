import {BizError} from "@/core";

export class BLScoreNotFoundError extends BizError {
  static id = 'remote.beatleader.score.map-user-id.not-found'
  id = BLScoreNotFoundError.id
  constructor(params: { username: string, mapId: string, diff?: string, mode?: string }) {
    super()
    this.params = params
  }
}
