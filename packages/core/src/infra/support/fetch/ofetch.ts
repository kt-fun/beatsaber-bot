import { $Fetch, createFetch, FetchOptions, ResponseType } from 'ofetch'
import { NotFoundError } from './error'

export const rofetch = createFetch({
  defaults: {
    retryStatusCodes: [400, 408, 409, 425, 429, 500, 502, 503, 504],
    retry: 3,
    retryDelay: 800,
  },
}).create({
  onResponseError({ request, response, options }) {
    if (response.status === 404) {
      throw new NotFoundError()
    }
  },
  onRequestError({ request, error }) {},
})

export type ExtendFetchOptions<R extends ResponseType = ResponseType, T = any> = {
  form?: Record<string, any>
} & FetchOptions<R, T>

export class Fetch {
  private options?: FetchOptions
  private ofetchInstance: $Fetch
  constructor(fetchInstance?: $Fetch, options?: FetchOptions) {
    this.options = options
    this.ofetchInstance = fetchInstance ?? rofetch
  }
   async fetch<T, R extends ResponseType>(request: string, options?: ExtendFetchOptions<R, T>) {
    let opt = {
      ...options,
      ...this.options
    } as ExtendFetchOptions<R, T>
    if(opt.form) {
      const form = new FormData()
      let f = opt.form
      Object.entries(form).forEach(([key, value]) => form.append(key, value))
      opt = {
        ...opt,
        headers: {
          ...opt.headers,
          'Content-Type': 'multipart/form-data'
        },
        body: f
      }
    }

    const res = await this.ofetchInstance<T, R>(request, opt)
    return res
  }
  get<T = any, R extends ResponseType = 'json'>(
    request: string,
    options?: ExtendFetchOptions<R>
  ) {
    return this.fetch<T, R>(request, { ...options, method: 'GET' })
  }
  post<T = any, R extends ResponseType = 'json'>(
    request: string,
    options?: ExtendFetchOptions<R>
  ) {
    return this.fetch<T, R>(request, { ...options, method: 'POST' })
  }
  put<T = any, R extends ResponseType = 'json'>(
    request: string,
    options?: ExtendFetchOptions<R>
  ) {
    return this.fetch(request, { ...options, method: 'PUT' })
  }
  patch<T = any, R extends ResponseType = 'json'>(
    request: string,
    options?: ExtendFetchOptions<R>
  ) {
    return this.fetch(request, { ...options, method: 'PATCH' })
  }
  delete<T = any, R extends ResponseType = 'json'>(
    request: string,
    options?: ExtendFetchOptions<R>
  ) {
    return this.fetch(request, { ...options, method: 'DELETE' })
  }
  head(request: string, options?: FetchOptions) {
    return this.fetch(request, { ...options, method: 'HEAD' })
  }

  extend(options: FetchOptions) {
    return new Fetch(this.ofetchInstance, { ...this.options, ...options })
  }
  baseUrl(url: string) {
    return this.extend({ baseURL: url })
  }
}

export { createFetch } from 'ofetch'
