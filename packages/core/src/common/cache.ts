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

export const WSCache = new LRUCache({
  max: 500,
  size: 50,
  sizeCalculation: () => 1,
  maxSize: 5000,
  allowStale: false,
  updateAgeOnGet: false,
  noUpdateTTL: true,
  ttl: 15 * 60 * 1000,
})
