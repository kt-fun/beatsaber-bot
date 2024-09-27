import { Config } from '@/config'
import { APIService } from '@/api'
import { RenderOption } from '@/img-render/interfaces'
import { Platform } from '@/interface'
import { BSMap } from '@/api/interfaces/beatsaver'
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
    onRenderStart?: () => void,
    onRenderError?: (e) => void
  ): Promise<Buffer>

  renderScore(
    scoreId: string,
    platform: Platform,
    onRenderStart?: () => void,
    onRenderError?: (e) => void
  ): Promise<Buffer>

  renderMapById(
    mapId: string,
    onRenderStart?: () => void,
    onRenderError?: (e) => void
  ): Promise<Buffer>

  renderMap(
    map: BSMap,
    onRenderStart?: () => void,
    onRenderError?: (e) => void
  ): Promise<Buffer>

  renderUrl(
    url: string,
    onRenderStart?: () => void,
    onRenderError?: (e) => void
  ): Promise<Buffer>
}
