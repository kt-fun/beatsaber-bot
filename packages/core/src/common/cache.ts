import { LRUCache } from 'lru-cache'

const options = {
  max: 500,
  maxSize: 5000,
  ttl: 1000 * 60 * 5,
  allowStale: false,
  updateAgeOnGet: true,
  updateAgeOnHas: true,
}

export const cache = new LRUCache(options)

export const createCache = <K extends {}, V extends {}, FC = unknown>(opt) =>
  new LRUCache<K, V, FC>(opt)
