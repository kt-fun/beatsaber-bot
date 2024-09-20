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
