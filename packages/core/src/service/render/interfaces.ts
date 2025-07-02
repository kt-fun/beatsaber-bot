import type { Platform } from '@/interface'
import {UserPreferenceStore} from "@/service/preference";
import {BSMap} from "@/service/api/interfaces/beatsaver";
import { PuppeteerOptions } from '@/infra/support/render'
export type RenderOption = RenderOptions & PuppeteerOptions

type RenderOptions = {
  userPreference?: UserPreferenceStore,
  onRenderStart?: () => void,
  onRenderError?: (e) => void
}

export interface IRenderService {
  renderRank(accountId: string, platform: Platform, renderOpts?: RenderOption): Promise<Buffer>
  renderScore(scoreId: string, renderOpts?: RenderOption): Promise<Buffer>
  renderMapById(mapId: string, renderOpts?: RenderOption): Promise<Buffer>
  renderMap(bsMap: BSMap, renderOpts?: RenderOption): Promise<Buffer>
  renderUrl(url: string, renderOpts?: RenderOption): Promise<Buffer>
}
