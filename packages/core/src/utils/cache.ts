import { LRUCache } from 'lru-cache'

const options = {
  max: 500,

  // for use with tracking overall storage size
  maxSize: 5000,
  sizeCalculation: (value, key) => 1,

  // for use when you need to clean up something when objects
  // are evicted from the cache
  // dispose: (value, key) => {},

  // how long to live in ms
  ttl: 1000 * 60 * 5,

  // return stale items before removing from cache?

  allowStale: false,

  updateAgeOnGet: true,
  updateAgeOnHas: true,

  // // async method to use for cache.fetch(), for
  // // stale-while-revalidate type of behavior
  // fetchMethod: async (
  //   key,
  //   staleValue,
  //   { options, signal, context }
  // ) => {},
}

export const cache = new LRUCache(options)
