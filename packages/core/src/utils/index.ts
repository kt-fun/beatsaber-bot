import { cache } from '@/utils/cache'
import { LRUCache } from 'lru-cache'

export * from './cache'

export const fetchWithCache = async <T>(...args): Promise<T> => {
  const res = cache.get(args)
  if (res) {
    return res as T
  }
  const result = await fetch(args as any).then((res) => res.json() as T)
  cache.set(args, result)
  return result as T
}

// export const fetch = async (...args) => {}

export const handleWSEventWithCache = (
  fnThat,
  fn,
  ttl,
  eventParser,
  eventFilter,
  eventIdSelector
) => {
  const WSCache = new LRUCache({
    max: 500,
    size: 50,
    sizeCalculation: (value, key) => 1,
    // for use with tracking overall storage size
    maxSize: 5000,
    allowStale: false,
    updateAgeOnGet: false,
    noUpdateTTL: true,
    ttl: ttl,
  })

  return async function (event: any) {
    const data = eventParser(event)
    const key = eventIdSelector(data)
    if (eventFilter(data) || WSCache.get(key)) {
      // console.log(`${key} hit cache, skip it, remainingTTL: `, WSCache.getRemainingTTL(key))
      return
    }
    WSCache.set(key, true)
    await fn.apply(fnThat, [data])
  }
}

export const sleep = async (millsec: number = 5000) => {
  await new Promise<void>((resolve, reject) => {
    setTimeout(resolve, millsec)
  })
}

const diffMap = {
  E: 'Easy',
  N: 'Normal',
  H: 'Hard',
  EX: 'Expert',
  EP: 'ExpertPlus',
  'EX+': 'ExpertPlus',
}

export const convertDiff = (diff: string | null) => {
  if (!diff) {
    return diff
  }
  return diffMap[diff.toUpperCase()]
}
