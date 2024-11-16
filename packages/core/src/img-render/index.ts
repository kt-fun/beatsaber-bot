import { APIService } from '@/api'
import {
  getBLPlayerComp,
  getBLRankScoreComp,
  getBSMapComp,
  getSSPlayerComp,
} from './result'
import createQrcode from './utils/qrcode'
import { RenderOption } from './interfaces'
import { Config } from '@/config'
import { getHtml } from '@/img-render/render'
import { BSMap } from '@/api/interfaces/beatsaver'
import { ImgRender, Platform } from '@/interface'
import { preferenceKey, UserPreferenceStore } from '@/utils'
import { ImageRenderError, RequestError } from '@/errors'
import { PuppeteerError, TimeoutError } from 'puppeteer-core'

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
    userPreference?: UserPreferenceStore,
    onRenderStart?: () => void,
    onRenderError?: (e) => void
    // type: 'remote' | 'local' = this.config.renderMode
  ) {
    return this._renderRank(accountId, platform, this.api, {
      ...this.baseConfig,
      type: 'local',
      onRenderError,
      onRenderStart,
      userPreference,
    } as RenderOption).catch((e) => {
      if (e instanceof TimeoutError || e instanceof PuppeteerError) {
        console.error(e)
        throw new ImageRenderError()
      }
      throw e
    })
  }

  _renderRank = async (
    accountId: string,
    platform: Platform,
    api: APIService,
    renderOpts: RenderOption
  ) => {
    const bg =
      (await renderOpts.userPreference.get<string>(
        platform == Platform.SS
          ? preferenceKey.ssProfileRenderImg.key
          : preferenceKey.blProfileRenderImg.key
      )) ?? 'https://www.loliapi.com/acg/pc/'
    // get user preference
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
        getHtml(getBLPlayerComp(scores, userInfo, bg)),
        renderOpts.onRenderStart,
        renderOpts.onRenderError
      )
    }
    const { scores, userInfo } =
      await api.ScoreSaber.getPlayerRecentScoreWithUserInfo(accountId)
    return this.htmlToImgBufferConverter(
      getHtml(getSSPlayerComp(scores, userInfo, bg)),
      renderOpts.onRenderStart,
      renderOpts.onRenderError
    )
  }

  async renderScore(
    scoreId: string,
    platform: Platform,
    userPreference?: UserPreferenceStore,
    onRenderStart?: () => void,
    onRenderError?: (e) => void
    // type: 'remote' | 'local' = this.config.renderMode
  ) {
    return this._renderScore(scoreId, platform, this.api, {
      ...this.baseConfig,
      type: 'local',
      userPreference,
      onRenderError,
      onRenderStart,
    } as RenderOption).catch((e) => {
      if (e instanceof TimeoutError || e instanceof PuppeteerError) {
        console.error(e)
        throw new ImageRenderError()
      }
      throw e
    })
  }

  _renderScore = async (
    scoreId: string,
    platform: Platform,
    api: APIService,
    renderOpts: RenderOption
  ) => {
    const bg =
      (await renderOpts?.userPreference?.get<string>(
        preferenceKey.blScoreImg.key
      )) ?? 'https://www.loliapi.com/acg/pc/'
    try {
      const { score, statistic, bsor, bsMap } =
        await api.BeatLeader.getScoreAndBSMapByScoreId(scoreId)

      const { aroundScores, regionTopScores, difficulties } =
        await api.BeatLeader.getAroundScoreAndRegionScoreByRankAndPage(
          score.leaderboardId,
          score.rank,
          score.player.country
        )
      return this.htmlToImgBufferConverter(
        getHtml(
          getBLRankScoreComp(
            score,
            aroundScores,
            regionTopScores,
            difficulties,
            bsMap,
            statistic,
            bsor,
            bg
          )
        ),
        renderOpts.onRenderStart,
        renderOpts.onRenderError
      )
    } catch (e) {
      if (e instanceof RequestError) {
        throw e
      }
      throw new ImageRenderError()
    }
  }

  async renderMapById(
    mapId: string,
    userPreference?: UserPreferenceStore,
    onRenderStart?: () => void,
    onRenderError?: (e) => void
    // type: 'remote' | 'local' = this.config.renderMode
  ) {
    const map = await this.api.BeatSaver.searchMapById(mapId)
    return this._renderMap(map, {
      ...this.baseConfig,
      type: 'local',
      userPreference,
      onRenderError,
      onRenderStart,
    } as RenderOption).catch((e) => {
      if (e instanceof TimeoutError || e instanceof PuppeteerError) {
        console.error(e)
        throw new ImageRenderError()
      }
      throw e
    })
  }

  async renderMap(
    map: BSMap,
    userPreference?: UserPreferenceStore,
    onRenderStart: () => void = noop,
    onRenderError: (e) => void = noop
    // type: 'remote' | 'local' = this.config.renderMode
  ) {
    return this._renderMap(map, {
      ...this.baseConfig,
      type: 'local',
      userPreference,
      onRenderError,
      onRenderStart,
    } as RenderOption).catch((e) => {
      if (e instanceof TimeoutError || e instanceof PuppeteerError) {
        console.error(e)
        throw new ImageRenderError()
      }
      throw e
    })
  }

  async renderUrl(url: string, onRenderStart?: () => void) {
    if (this.urlToImgBufferConverter) {
      return this.urlToImgBufferConverter(url, onRenderStart).catch((e) => {
        if (e instanceof TimeoutError || e instanceof PuppeteerError) {
          console.error(e)
          throw new ImageRenderError()
        }
        throw e
      })
    }
  }

  _renderMap = async (bsMap: BSMap, renderOpts: RenderOption) => {
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
