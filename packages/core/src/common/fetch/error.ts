export class RequestError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'RequestError'
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
