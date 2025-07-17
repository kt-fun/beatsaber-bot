import {BizError} from "@/core";

export class RemoteResourceByIdNotFoundError extends BizError {
  static id = 'remote.platform.resource.id.not-found'
  id = RemoteResourceByIdNotFoundError.id
  constructor(params: { resourceId: string, platform: string, resourceType: string }) {
    super()
    this.params = params
  }
}

export class BLAccountNotFoundError extends RemoteResourceByIdNotFoundError {
  static id = 'remote.beatleader.account.id.not-found'
  id = BLAccountNotFoundError.id
  constructor(params: { accountId: string }) {
    super({ resourceId: params.accountId, platform: 'beatleader', resourceType: 'user' })
    this.params = params
  }
}

export class SSAccountNotFoundError extends RemoteResourceByIdNotFoundError {
  static id = 'remote.scoresaber.account.id.not-found'
  id = SSAccountNotFoundError.id
  constructor(params: { accountId: string }) {
    super({ resourceId: params.accountId, platform: 'scoresaber', resourceType: 'user' })
    this.params = params
  }
}

export class BSAccountNotFoundError extends RemoteResourceByIdNotFoundError {
  static id = 'remote.beatsaver.account.id.not-found'
  id = BSAccountNotFoundError.id
  constructor(params: { accountId: string }) {
    super({ resourceId: params.accountId, platform: 'beatsaver', resourceType: 'user' })
    this.params = params
  }
}

export class BSMapNotFoundError extends RemoteResourceByIdNotFoundError {
  static id = 'remote.beatsaver.bsmap.id.not-found'
  id = BSMapNotFoundError.id
  constructor(params: { mapId: string }) {
    super({ resourceId: params.mapId, platform: 'beatsaver', resourceType: 'user' })
    this.params = params
  }
}

export class BLScoreIdFoundError extends RemoteResourceByIdNotFoundError {
  static id = 'remote.beatleader.score.id.not-found'
  id = BLScoreIdFoundError.id
  constructor(params: { id: string }) {
    super({ resourceId: params.id, platform: 'beatleader', resourceType: 'score' })
    this.params = params
  }
}

export class AccountNotFoundError extends RemoteResourceByIdNotFoundError {
  static id = 'remote.platform.account.id.not-found'
  id = AccountNotFoundError.id
  constructor(params?: { platform: string, accountId: string }) {
    super({ resourceId: params.accountId, platform: params.accountId, resourceType: 'user' })
    this.params = params
  }
}
