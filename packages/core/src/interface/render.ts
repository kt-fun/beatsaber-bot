import { Config } from '@/config'
import { APIService } from '@/api'
import { RenderOption } from '@/img-render/interfaces'
import { Platform, UserPreference } from '@/interface'
import { BSMap } from '@/api/interfaces/beatsaver'
import { UserPreferenceStore } from '@/utils'
type HtmlToImgBufferConverter = (
  html: string,
  onRenderStart?: () => void,
  onRenderError?: (e) => void
) => Promise<any>
export interface ImgRender {
  config: Config
  api: APIService
  baseConfig: Partial<RenderOption>
  htmlToImgBufferConverter: HtmlToImgBufferConverter
  _renderRank: (
    accountId: string,
    platform: Platform,
    api: APIService,
    renderOpts: RenderOption
  ) => Promise<any>
  _renderScore: (
    scoreId: string,
    platform: Platform,
    api: APIService,
    renderOpts: RenderOption
  ) => Promise<any>
  _renderMap: (bsMap: BSMap, renderOpts: RenderOption) => Promise<any>

  renderRank(
    accountId: string,
    platform: Platform,
    userPreference?: UserPreferenceStore,
    onRenderStart?: () => void,
    onRenderError?: (e) => void
  ): Promise<Buffer>

  renderScore(
    scoreId: string,
    platform: Platform,
    userPreference?: UserPreferenceStore,
    onRenderStart?: () => void,
    onRenderError?: (e) => void
  ): Promise<Buffer>

  renderMapById(
    mapId: string,
    userPreference?: UserPreferenceStore,
    onRenderStart?: () => void,
    onRenderError?: (e) => void
  ): Promise<Buffer>

  renderMap(
    map: BSMap,
    userPreference?: UserPreferenceStore,
    onRenderStart?: () => void,
    onRenderError?: (e) => void
  ): Promise<Buffer>

  renderUrl(
    url: string,
    // userPreference?: UserPreferenceStore,
    onRenderStart?: () => void,
    onRenderError?: (e) => void
  ): Promise<Buffer>
}
