import { Fetch } from './ofetch'
import { Logger } from '@/core'
import { NotFoundError } from './error'

const ofetch = new Fetch()

export const createFetch = (logger: Logger) => {
  return ofetch.extend({
    onRequest: (context) => {
      logger.debug(`[fetch -->] ${context.options.baseURL}${context.request}`)
      logger.debug(`[fetch -->] ${JSON.stringify(context.options, null)}`)
    },
    onResponse: (context) => {
      logger.debug(`[fetch <--] ${context.request} ${context.response.status}`)
      switch (context.options.responseType) {
        case 'text':
          logger.debug(`[fetch <--] ${context.response._data}`)
          break
        case "json":
          logger.debug(`[fetch -->] ${JSON.stringify(context.response._data, null)}`)
          break
      }
    },
    onResponseError({ request, response, options, error }) {
      logger.debug(`response error ${response.statusText}`, error)
      if (response.status === 404) {
        throw new NotFoundError()
      }
    },
    ignoreResponseError: false,
  })
}

export { Fetch } from './ofetch'
