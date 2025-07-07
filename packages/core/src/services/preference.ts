import { DB } from '@/interface'
import { LRUCache } from 'lru-cache'

const cache = new LRUCache({
  max: 500,
  maxSize: 500,
  sizeCalculation: () => 1,
  ttl: 1000 * 60 * 60 * 24 * 7,
  allowStale: false,
  updateAgeOnGet: true,
  updateAgeOnHas: true,
})

export class UserPreferenceStore {
  v: any = undefined
  constructor(
    private db: DB,
    private uid: string
  ) {}
  async getUserPreference(uid: string) {
    return new UserPreferenceStore(this.db, uid)
  }
  async set<T extends string | number | boolean>(
    key: string,
    value: T
  ): Promise<boolean> {
    if (!this.v) {
      this.v = (await this.db.getUserPreference(this.uid)) ?? {}
    }
    const cacheKey = `${this.uid}`
    const v = {
      ...this.v,
      [key]: value,
    }
    await this.db.storeUserPreference(this.uid, v)
    cache.set(cacheKey, v)
    this.v = v
    return true
  }
  async get<T extends string | number | boolean>(
    key: string
  ): Promise<T | undefined> {
    const cacheKey = `${this.uid}`
    const has = cache.has(cacheKey)
    if (has) {
      const v = cache.get(cacheKey) as T
      return v?.[key] ?? preferenceSchema[key]?.default
    }
    const value = (await this.db.getUserPreference(this.uid)) ?? {}
    cache.set(cacheKey, value)
    return (value?.[key] as T) ?? preferenceSchema[key]?.default
  }
  async configEntries(): Promise<Record<string, any>> {
    await this.get('')
    return cache.get(this.uid) as Record<string, any>
  }
}

type PreferenceItem = {
  key: string
  i18nName: string
  valueType: 'img-url' | 'string' | 'number' | 'boolean'
  default: any
}

export const preferenceKey = {
  blProfileRenderImg: {
    key: 'bl::profile::render::img',
    i18nName: 'BLProfile背景图片',
  },
  ssProfileRenderImg: {
    key: 'ss::profile::render::img',
    i18nName: 'SSProfile背景图片',
  },
  blScoreImg: {
    key: 'bl::score::render::img',
    i18nName: 'BLScore背景图片',
  },
}

export const preferenceSchema: Record<string, PreferenceItem> = {
  'bl::profile::render::img': {
    key: 'bl::profile::render::img',
    i18nName: 'BLProfile背景图片',
    valueType: 'img-url',
    default: 'https://www.loliapi.com/acg/pc/',
  },
  'ss::profile::render::img': {
    key: 'ss::profile::render::img',
    i18nName: 'SSProfile背景图片',
    valueType: 'img-url',
    default: 'https://www.loliapi.com/acg/pc/',
  },
  'bl::score::render::img': {
    key: 'bl::score::render::img',
    i18nName: 'BLScore背景图片',
    valueType: 'img-url',
    default: 'https://www.loliapi.com/acg/pc/',
  },
}

const preferenceMap = new Map<string, PreferenceItem>()

Object.entries(preferenceSchema).forEach(([key, value]) => {
  preferenceMap.set(value.i18nName, value)
})

export const hasPreferenceSchemaByKeyOrName = (key: string) => {
  if (key in preferenceSchema) {
    return true
  }
  return preferenceMap.has(key)
}
export const getPreferenceSchemaByKeyOrName = (key: string) => {
  if (key in preferenceSchema) {
    return preferenceSchema[key]
  }
  return preferenceMap.get(key)
}
