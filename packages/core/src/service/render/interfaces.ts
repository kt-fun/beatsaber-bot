import type { Platform } from '@/interface'
import {UserPreferenceStore} from "@/service/preference";
import {BSMap} from "@/service/api/interfaces/beatsaver";

export type RenderOption = RenderOptions

type RenderOptions = {
  userPreference?: UserPreferenceStore,
  onRenderStart?: () => void,
  onRenderError?: (e) => void
}

export interface IRenderService {
  renderRank(accountId: string, platform: Platform, renderOpts?: RenderOptions): Promise<Buffer>
  renderScore(scoreId: string, renderOpts?: RenderOptions): Promise<Buffer>
  renderMapById(mapId: string, renderOpts?: RenderOptions): Promise<Buffer>
  renderMap(bsMap: BSMap, renderOpts?: RenderOptions): Promise<Buffer>
  renderUrl(url: string, renderOpts?: RenderOptions): Promise<Buffer>
}
