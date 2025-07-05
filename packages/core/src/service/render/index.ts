import {IRenderService, RenderOption} from './interfaces'
import { getHtml } from '@/components'
import { PuppeteerError, TimeoutError } from 'puppeteer-core'
import { Platform } from '@/interface'
import {getBLPlayerComp, getBLRankScoreComp, getBSMapComp, getSSPlayerComp} from '@/components/pages'
import {preferenceKey} from "../preference";
import {ImageRenderError, RequestError} from "@/infra/errors";
import createQrcode from "@/components/utils/qrcode";
import {APIService} from "../api";
import {BSMap} from "../api/interfaces/beatsaver";
import {CreateImageRenderOption, getImageRender, ImageRender} from "@/infra/support/render";


const getPreferenceKey = (platform: string) => {
  return platform == Platform.SS
    ? preferenceKey.ssProfileRenderImg.key
    : preferenceKey.blProfileRenderImg.key
}

export class RenderService implements IRenderService {
  private constructor(
    private api: APIService,
    private imageRender: ImageRender
  ) {}

  static create(imgRenderConfig: CreateImageRenderOption & { api: APIService }) {
    const { api, ...config} = imgRenderConfig
    return new RenderService(api, getImageRender(config))
  }

  async renderRank(
    accountId: string,
    platform: Platform,
    renderOpts?: RenderOption
  ) {
    try {
      let bg = (await renderOpts?.userPreference?.get<string>(getPreferenceKey(platform)))
      bg = bg || 'https://www.loliapi.com/acg/pc/'
      let html: string
      if (platform == Platform.BL) {
        const { scores, userInfo } = await this.api.getBLPlayerScoresWithUserInfo(accountId)
        html = getHtml(getBLPlayerComp(scores, userInfo, bg))
      } else {
        const { scores, userInfo } = await this.api.getSSPlayerRecentScoreWithUserInfo(accountId)
        html = getHtml(getSSPlayerComp(scores, userInfo, bg))
      }
      return this.imageRender.html2img(html, {selector: '#render-result', ...renderOpts})
    }catch (e) {
      if (e instanceof TimeoutError || e instanceof PuppeteerError) {
        throw new ImageRenderError()
      }
      throw e
    }
  }

  async renderScore(
    scoreId: string,
    renderOpts?: RenderOption
  ) {
    const bg = (await renderOpts?.userPreference?.get<string>(preferenceKey.blScoreImg.key))
      ?? 'https://www.loliapi.com/acg/pc/'
    try {
      const { score, statistic, bsor, bsMap } =
        await this.api.getScoreAndBSMapByScoreId(scoreId)

      const { aroundScores, regionTopScores, difficulties } =
        await this.api.getAroundScoreAndRegionScoreByRankAndPage(
          score.leaderboardId,
          score.rank,
          score.player.country
        )
      return this.imageRender.html2img(
        getHtml(getBLRankScoreComp(score, aroundScores, regionTopScores, difficulties, bsMap, statistic, bsor, bg)),
        {selector: '#render-result', ...renderOpts}
      )
    }catch (e) {
      if (e instanceof RequestError) {
        throw e
      }
      throw new ImageRenderError()
    }
  }

  async renderMapById(
    mapId: string,
    renderOption: RenderOption
  ) {
    const map = await this.api.BeatSaver.searchMapById(mapId)
    return this.renderMap(map, renderOption)
  }

  async renderMap(
    bsMap: BSMap,
    renderOption?: RenderOption
  ) {
    const previewQrUrl = await createQrcode(`https://allpoland.github.io/ArcViewer/?id=${bsMap.id}`)
    const bsMapQrUrl = await createQrcode(`https://beatsaver.com/maps/${bsMap.id}`)
    return this.imageRender.html2img(
      getHtml(getBSMapComp(bsMap, bsMapQrUrl, previewQrUrl)), {selector: '#render-result', ...renderOption}
    )
  }

  async renderUrl(url: string, renderOption?: RenderOption) {
    renderOption?.onRenderStart?.()
    try {
      return this.imageRender.url2img(url, renderOption)
    }catch (e) {
      renderOption?.onRenderError?.(e)
    }
  }
}
