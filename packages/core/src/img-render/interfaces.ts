import { UserPreferenceStore } from '@/utils'

interface BaseRenderOpts {
  type: 'local' | 'remote'
  puppeteer: any
  onRenderStart?: () => void
  onRenderError?: (e) => void
  customBackground?: string
  waitTimeout?: number
  userPreference?: UserPreferenceStore
  // screenWaitTimeout?: number
}

export interface RemoteRenderOpts extends BaseRenderOpts {
  type: 'remote'
  renderBaseURL: string
}

export interface LocalRenderOpts extends BaseRenderOpts {
  type: 'local'
}

export type RenderOption = RemoteRenderOpts | LocalRenderOpts
