export class UnexpectedError extends Error {
  constructor() {
    super('UnexpectedError')
  }
}

export class BizError extends Error {
  id: string
  params?: any
}

export class ScoreNotFoundError extends BizError {
  constructor(params?: any) {
    super('ScoreNotFoundError')
    this.name = 'ScoreNotFoundError'
    this.id = 'commands.bsbot.me.score-not-found'
    this.params = params
  }
}

export class AccountBindingNotFoundError extends BizError {
  constructor(params?: any) {
    super('AccountBindingNotFoundError')
    this.name = 'AccountBindingNotFoundError'
    this.id = 'commands.bsbot.score.not-bind'
    this.params = params
  }
}
export class UnknownUserIDError extends BizError {
  constructor(params?: any) {
    super('UnknownUserIDError')
    this.name = 'UnknownUserIDError'
    this.id = 'commands.bsbot.me.not-found'
    this.params = params
  }
}
export class InvalidMapIdError extends BizError {
  constructor(params?: any) {
    super('InvalidMapIdError')
    this.name = 'InvalidMapIdError'
    this.id = 'commands.bsbot.id.error-map-id'
    this.params = params
  }
}

export class MapIdNotFoundError extends BizError {
  constructor(params?: any) {
    super('MapIdNotFoundError')
    this.name = 'MapIdNotFoundError'
    this.id = 'commands.bsbot.id.not-found'
    this.params = params
  }
}

export class BLIDNotFoundError extends BizError {
  constructor(params?: any) {
    super('BLIDNotFoundError')
    this.name = 'BLIDNotFoundError'
    this.id = 'commands.bsbot.bl.account.not-found'
    this.params = params
    this.params = params
  }
}
export class SSIDNotFoundError extends BizError {
  constructor(params?: any) {
    super('SSIDNotFoundError')
    this.name = 'SSIDNotFoundError'
    this.id = 'commands.bsbot.ss.account.not-found'
    this.params = params
    this.params = params
  }
}
export class BSIDNotFoundError extends BizError {
  constructor(params?: any) {
    super('BSIDNotFoundError')
    this.name = 'BSIDNotFoundError'
    this.id = 'commands.bsbot.bs.account.not-found'
    this.params = params
    this.params = params
  }
}

export class ScoreSaberIDNotFoundError extends BizError {
  constructor(params?: any) {
    super('ScoreSaberIdNotFoundError')
    this.name = 'ScoreSaberIdNotFoundError'
    this.id = 'commands.bsbot.bind.not-found'
    this.params = params
    this.params = params
  }
}

export class SessionPromotionTimeoutError extends BizError {
  constructor(params?: any) {
    super('SessionPromotionTimeoutError')
    this.name = 'SessionPromotionTimeoutError'
    this.id = 'commands.bsbot.session-promotion-timeout'
    this.params = params
  }
}

export class SessionPromotionCancelError extends BizError {
  constructor(params?: any) {
    const name = 'SessionPromotionCancelError'
    super(name)
    this.name = name
    this.id = 'commands.bsbot.bind.cancel'
    this.params = params
  }
}

export class SubscriptionExistError extends BizError {
  constructor(params?: any) {
    super('SubscriptionExistError')
    this.params = params
    this.name = 'SubscriptionExistError'
    this.id = 'commands.bsbot.subscribe.exist'
    this.params = params
  }
}
export class NoneSubscriptionExistError extends BizError {
  constructor(params?: any) {
    super('NoneSubscriptionExistError')
    this.name = 'NoneSubscriptionExistError'
    this.id = 'commands.bsbot.subscribe.info.none'
    this.params = params
  }
}

export class SubscriptionNotExistError extends BizError {
  constructor(params?: any) {
    super('SubscriptionNotExistError')
    this.name = 'SubscriptionNotExistError'
    this.id = 'commands.bsbot.unsubscribe.nosub'
    this.params = params
  }
}

export class ImageRenderError extends BizError {
  constructor(params?: any) {
    super('ImageRenderError')
    this.name = 'ImageRenderError'
    this.id = 'commands.bsbot.render.error'
    this.params = params
  }
}
export class RequestError extends BizError {
  constructor(params?: any) {
    super('RequestError')
    this.name = 'RequestError'
    this.id = 'commands.bsbot.request.error'
    this.params = params
  }
}

export class ReachNetworkRetryLimitError extends BizError {
  constructor(params?: any) {
    super('ReachNetworkRetryLimitError')
    this.name = 'ReachNetworkRetryLimitError'
    this.id = 'commands.bsbot.common.error.reach-request-retry-limit'
    this.params = params
  }
}

export class NotImplementedError extends BizError {
  constructor(params?: any) {
    super('NotImplementedError')
    this.name = 'NotImplementedError'
    this.id = 'commands.bsbot.common.error.not-implemented'
    this.params = params
  }
}

export class EmptyPromptError extends BizError {
  constructor(params?: any) {
    super('EmptyPromptError')
    this.name = 'EmptyPromptError'
    this.id = 'commands.bsbot.common.error.empty-prompt'
    this.params = params
  }
}
