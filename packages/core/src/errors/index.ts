export class ScoreNotFoundError extends Error {
  id: string
  params: any
  constructor(message) {
    super(message)
    this.name = 'ScoreNotFoundError'
    this.id = 'commands.bsbot.me.score-not-found'
  }
}

export class AccountBindingNotFoundError extends Error {
  id: string
  params: any
  constructor(message?: string) {
    super(message)
    this.name = 'AccountBindingNotFoundError'
    this.id = 'commands.bsbot.score.not-bind'
  }
}

export class InvalidMapIdError extends Error {
  id: string
  params: any
  constructor(message) {
    super(message)
    this.name = 'InvalidMapIdError'
    this.id = 'commands.bsbot.id.error-map-id'
  }
}

export class MapIdNotFoundError extends Error {
  id: string
  params: any
  constructor(message) {
    super(message)
    this.name = 'MapIdNotFoundError'
    this.id = 'commands.bsbot.id.not-found'
  }
}

export class NetworkError extends Error {
  id: string
  params: any
  constructor(message) {
    super(message)
    this.name = 'NetworkError'
    this.id = 'commands.bsbot.id.not-found'
  }
}

export class ScoreSaberIDNotFoundError extends Error {
  id: string
  params: any
  constructor(input: string) {
    super()
    this.name = 'ScoreSaberIdNotFoundError'
    this.id = 'commands.bsbot.bind.not-found'
    this.params = input
  }
}

export class SessionPromotionTimeoutError extends Error {
  id: string
  constructor() {
    super()
    this.name = 'SessionPromotionTimeoutError'
    this.id = 'commands.bsbot.session-promotion-timeout'
  }
}

export class SessionPromotionCancelError extends Error {
  id: string
  constructor() {
    super()
    this.name = 'SessionPromotionCancelError'
    this.id = 'commands.bsbot.bind.cancel'
  }
}

export class SubscriptionExistError extends Error {
  id: string
  params: any
  constructor(message?: string) {
    super(message)
    this.name = 'SubscriptionExistError'
    this.id = 'commands.bsbot.subscribe.exist'
  }
}
export class NoneSubscriptionExistError extends Error {
  id: string
  params: any
  constructor(message?: string) {
    super(message)
    this.name = 'NoneSubscriptionExistError'
    this.id = 'commands.bsbot.subscribe.info.none'
  }
}

export class SubscriptionNotExistError extends Error {
  id: string
  params: any
  constructor(message?: string) {
    super(message)
    this.name = 'SubscriptionNotExistError'
    this.id = 'commands.bsbot.unsubscribe.nosub'
  }
}
