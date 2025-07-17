export class RequestError extends Error {
  constructor(error: Error) {
    super()
    this.cause = error
  }
}

export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class RateLimitError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'RateLimitError'
  }
}
