import { BSMap, Platform } from '../../types'
import { APIService } from '../api'
import { renderRemoteMap, renderRemoteRank, renderRemoteScore } from './remote'
import {
  renderBLPlayerImg,
  renderBLScoreImg,
  renderBSMapImg,
  renderSSPlayerImg,
} from './result'
import createQrcode from './utils/qrcode'
import { RemoteRenderOpts, RenderOption } from './interfaces'
import { Context, Logger } from 'koishi'
import { Config } from '../../config'
import Puppeteer from 'koishi-plugin-puppeteer'
import { screenshotTmp } from './renderImg'
const noop = () => {}
export class RenderService {
  private puppeteer: Puppeteer
  private config: Config
  private api: APIService
  private baseConfig: Partial<RenderOption>
  private constructor(ctx: Context, config: Config, api: APIService) {
    this.puppeteer = ctx.puppeteer
    this.config = config
    this.api = api
    this.baseConfig = {
      puppeteer: this.puppeteer,
      renderBaseURL: this.config.remoteRenderURL,
      waitTimeout: this.config.rankWaitTimeout,
    }
  }

  static create(ctx: Context, config: Config, api: APIService) {
    // let ins = new RenderService(ctx,config,api)
    // const proxied = new Proxy<RenderService>(ins, {
    //   get(target, prop, receiver) {
    //     const member = target[prop];
    //     if(member) {
    //       return createProxiedAPIService(member)
    //     }
    //     return undefined
    //   },
    //   set(target, property, value, receiver) {
    //     return false
    //   }
    // })
    // return proxied
    return new RenderService(ctx, config, api)
  }

  async renderRank(
    accountId: string,
    platform: Platform,
    onRenderStart?: () => void,
    onRenderError?: (e) => void,
    type: 'remote' | 'local' = this.config.renderMode
  ) {
    return this._renderRank(accountId, platform, this.api, {
      ...this.baseConfig,
      type,
      onRenderError,
      onRenderStart,
    } as RenderOption)
  }

  private _renderRank = async (
    accountId: string,
    platform: Platform,
    api: APIService,
    renderOpts: RenderOption
  ) => {
    if (renderOpts.type == 'remote') {
      const remoteP = platform == Platform.SS ? 'score-saber' : 'beat-leader'
      return renderRemoteRank(
        accountId,
        remoteP,
        renderOpts as RemoteRenderOpts
      )
    }
    if (platform == Platform.BL) {
      const { scores, userInfo } =
        await api.BeatLeader.getPlayerScoresWithUserInfo(accountId)
      return renderBLPlayerImg(
        renderOpts.puppeteer,
        scores,
        userInfo,
        renderOpts.onRenderStart,
        renderOpts.onRenderError
      )
    }
    const { scores, userInfo } =
      await api.ScoreSaber.getPlayerRecentScoreWithUserInfo(accountId)
    return renderSSPlayerImg(
      renderOpts.puppeteer,
      scores,
      userInfo,
      renderOpts.onRenderStart,
      renderOpts.onRenderError
    )
  }

  async renderScore(
    scoreId: string,
    platform: Platform,
    onRenderStart?: () => void,
    onRenderError?: (e) => void,
    type: 'remote' | 'local' = this.config.renderMode
  ) {
    return this._renderScore(scoreId, platform, this.api, {
      ...this.baseConfig,
      type,
      onRenderError,
      onRenderStart,
    } as RenderOption)
  }

  private _renderScore = async (
    scoreId: string,
    platform: Platform,
    api: APIService,
    renderOpts: RenderOption
  ) => {
    const remoteP = 'beat-leader'
    if (renderOpts.type == 'remote') {
      const remoteP = platform == Platform.SS ? 'score-saber' : 'beat-leader'
      return renderRemoteScore(scoreId, remoteP, renderOpts as RemoteRenderOpts)
    }
    const { score, statistic, bsor, bsMap } = await api.BeatLeader.withRetry(3)
      .onRetry((times, e) => {
        console.log(`retrying ${times} due to ${e}`)
      })
      .getScoreAndBSMapByScoreId(scoreId)
      .catch((e) => {
        throw Error('渲染错误')
      })
    const qrcodeUrl = await createQrcode(
      `https://replay.beatleader.xyz/?scoreId=${score.id}`
    )
    return renderBLScoreImg(
      renderOpts.puppeteer,
      score,
      bsMap,
      statistic,
      bsor,
      qrcodeUrl,
      renderOpts.onRenderStart,
      renderOpts.onRenderError
    )
  }

  async renderMapById(
    mapId: string,
    onRenderStart?: () => void,
    onRenderError?: (e) => void,
    type: 'remote' | 'local' = this.config.renderMode
  ) {
    const map = await this.api.BeatSaver.searchMapById(mapId)
    return this._renderMap(map, {
      ...this.baseConfig,
      type,
      onRenderError,
      onRenderStart,
    } as RenderOption)
  }

  async renderMap(
    map: BSMap,
    onRenderStart: () => void = noop,
    onRenderError: (e) => void = noop,
    type: 'remote' | 'local' = this.config.renderMode
  ) {
    return this._renderMap(map, {
      ...this.baseConfig,
      type,
      onRenderError,
      onRenderStart,
    } as RenderOption)
  }

  async renderLBScore() {
    return screenshotTmp(
      this.puppeteer,
      'https://aiobs.ktlab.io/tmp/lb/score',
      '#render-result',
      () => {},
      8000
    )
  }

  async renderLBHitCount() {
    return screenshotTmp(
      this.puppeteer,
      'https://aiobs.ktlab.io/tmp/lb/hitcnt',
      '#render-result',
      () => {},
      8000
    )
  }

  private _renderMap = async (bsMap: BSMap, renderOpts: RenderOption) => {
    if (renderOpts.type == 'remote') {
      for (let i = 0; i < 3; i++) {
        const image = await renderRemoteMap(
          bsMap.id,
          renderOpts as RemoteRenderOpts
        )
        if (image) {
          return image
        }
      }
    }
    const previewQrUrl = await createQrcode(
      `https://allpoland.github.io/ArcViewer/?id=${bsMap.id}`
    )
    const bsMapQrUrl = await createQrcode(
      `https://beatsaver.com/maps/${bsMap.id}`
    )
    return await renderBSMapImg(
      renderOpts.puppeteer,
      bsMap,
      bsMapQrUrl,
      previewQrUrl,
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
