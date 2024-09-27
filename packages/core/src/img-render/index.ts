import { APIService } from '@/api'
import {
  getBLPlayerComp,
  getBLRankScoreComp,
  getBLScoreComp,
  getBSMapComp,
  getSSPlayerComp,
} from './result'
import createQrcode from './utils/qrcode'
import { RenderOption } from './interfaces'
import { Config } from '@/config'
import { getHtml } from '@/img-render/render'
import { BSMap } from '@/api/interfaces/beatsaver'
import { ImgRender, Platform } from '@/interface'

const noop = () => {}
// render service supply rendered components, impler just need to provide the html-to-img converter
type HtmlToImgBufferConverter = (
  html: string,
  onRenderStart?: () => void,
  onRenderError?: (e) => void
) => Promise<Buffer>

type UrlToImgBufferConverter = HtmlToImgBufferConverter

export abstract class RenderService implements ImgRender {
  config: Config
  api: APIService
  baseConfig: Partial<RenderOption>
  htmlToImgBufferConverter: HtmlToImgBufferConverter
  urlToImgBufferConverter: UrlToImgBufferConverter
  async renderRank(
    accountId: string,
    platform: Platform,
    onRenderStart?: () => void,
    onRenderError?: (e) => void
    // type: 'remote' | 'local' = this.config.renderMode
  ) {
    return this._renderRank(accountId, platform, this.api, {
      ...this.baseConfig,
      type: 'local',
      onRenderError,
      onRenderStart,
    } as RenderOption)
  }

  _renderRank = async (
    accountId: string,
    platform: Platform,
    api: APIService,
    renderOpts: RenderOption
  ) => {
    // if (renderOpts.type == 'remote') {
    //   const remoteP = platform == Platform.SS ? 'score-saber' : 'beat-leader'
    //   return renderRemoteRank(
    //     accountId,
    //     remoteP,
    //     renderOpts as RemoteRenderOpts
    //   )
    // }
    if (platform == Platform.BL) {
      const { scores, userInfo } =
        await api.BeatLeader.getPlayerScoresWithUserInfo(accountId)
      //
      return this.htmlToImgBufferConverter(
        getHtml(getBLPlayerComp(scores, userInfo)),
        renderOpts.onRenderStart,
        renderOpts.onRenderError
      )
    }
    const { scores, userInfo } =
      await api.ScoreSaber.getPlayerRecentScoreWithUserInfo(accountId)
    return this.htmlToImgBufferConverter(
      getHtml(getSSPlayerComp(scores, userInfo)),
      renderOpts.onRenderStart,
      renderOpts.onRenderError
    )
  }

  async renderScore(
    scoreId: string,
    platform: Platform,
    onRenderStart?: () => void,
    onRenderError?: (e) => void
    // type: 'remote' | 'local' = this.config.renderMode
  ) {
    return this._renderScore(scoreId, platform, this.api, {
      ...this.baseConfig,
      type: 'local',
      onRenderError,
      onRenderStart,
    } as RenderOption)
  }

  _renderScore = async (
    scoreId: string,
    platform: Platform,
    api: APIService,
    renderOpts: RenderOption
  ) => {
    const remoteP = 'beat-leader'
    // if (renderOpts.type == 'remote') {
    //   const remoteP = platform == Platform.SS ? 'score-saber' : 'beat-leader'
    //   return renderRemoteScore(scoreId, remoteP, renderOpts as RemoteRenderOpts)
    // }
    const { score, statistic, bsor, bsMap } = await api.BeatLeader.withRetry(3)
      .onRetry((times, e) => {
        console.log(`retrying ${times} due to ${e}`)
      })
      .getScoreAndBSMapByScoreId(scoreId)
      .catch((e) => {
        throw Error('渲染错误')
      })

    const { aroundScores, regionTopScores, difficulties } =
      await api.BeatLeader.withRetry(
        3
      ).getAroundScoreAndRegionScoreByRankAndPage(
        score.leaderboardId,
        score.rank,
        score.player.country
      )
    // api.BeatLeader
    // const qrcodeUrl = await createQrcode(
    //   `https://replay.beatleader.xyz/?scoreId=${score.id}`
    // )
    return this.htmlToImgBufferConverter(
      getHtml(
        getBLRankScoreComp(
          score,
          aroundScores,
          regionTopScores,
          difficulties,
          bsMap,
          statistic,
          bsor
        )
      ),
      renderOpts.onRenderStart,
      renderOpts.onRenderError
    )
  }

  async renderMapById(
    mapId: string,
    onRenderStart?: () => void,
    onRenderError?: (e) => void
    // type: 'remote' | 'local' = this.config.renderMode
  ) {
    const map = await this.api.BeatSaver.searchMapById(mapId)
    return this._renderMap(map, {
      ...this.baseConfig,
      type: 'local',
      onRenderError,
      onRenderStart,
    } as RenderOption)
  }

  async renderMap(
    map: BSMap,
    onRenderStart: () => void = noop,
    onRenderError: (e) => void = noop
    // type: 'remote' | 'local' = this.config.renderMode
  ) {
    return this._renderMap(map, {
      ...this.baseConfig,
      type: 'local',
      onRenderError,
      onRenderStart,
    } as RenderOption)
  }

  async renderUrl(url: string) {
    if (this.urlToImgBufferConverter) {
      return this.urlToImgBufferConverter(url)
    }
  }

  _renderMap = async (bsMap: BSMap, renderOpts: RenderOption) => {
    // if (renderOpts.type == 'remote') {
    //   for (let i = 0; i < 3; i++) {
    //     const image = await renderRemoteMap(
    //       bsMap.id,
    //       renderOpts as RemoteRenderOpts
    //     )
    //     if (image) {
    //       return image
    //     }
    //   }
    // }
    const previewQrUrl = await createQrcode(
      `https://allpoland.github.io/ArcViewer/?id=${bsMap.id}`
    )
    const bsMapQrUrl = await createQrcode(
      `https://beatsaver.com/maps/${bsMap.id}`
    )
    return this.htmlToImgBufferConverter(
      getHtml(getBSMapComp(bsMap, bsMapQrUrl, previewQrUrl)),
      renderOpts.onRenderStart,
      renderOpts.onRenderError
    )
  }
}

class RenderHelper {
  private _onStart: () => void
  private _onRenderStart: () => void
  private _onRenderError: (e) => void

  constructor() {}

  onStart(func: () => void) {
    this._onStart = func
    return this
  }

  onRenderError(func: (e) => void) {
    this._onRenderError = func
    return this
  }
}
