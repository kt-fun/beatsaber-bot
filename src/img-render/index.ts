import Puppeteer from "koishi-plugin-puppeteer";
import {BSMap} from "../types";
import {renderRemoteMap, renderRemoteRank, renderRemoteScore} from "./remote";
import {renderBLPlayerImg, renderBLScoreImg, renderBSMapImg, renderSSPlayerImg} from "./result";
import {APIService} from "../service";
import {Platform} from "../types/platform";
import createQrcode from "./utils/qrcode";

export * from './remote'

interface BaseRenderOpts {
  type: 'local'|'remote'
  puppeteer: Puppeteer,
  onStartRender?: ()=> void,
  onRenderError?: (e)=> void,
  customBackground?: string,
  waitTimeout?: number,
  // screenWaitTimeout?: number
}

export interface RemoteRenderOpts extends BaseRenderOpts {
  type: 'remote',
  renderBaseURL: string,
}

export interface LocalRenderOpts extends BaseRenderOpts {
  type: 'local',
}

export type RenderOption = RemoteRenderOpts | LocalRenderOpts

export const renderRank =async (accountId: string, platform: Platform, api:APIService, renderOpts:RenderOption) => {
  if(renderOpts.type == 'remote') {
    let remoteP = platform == Platform.SS ? 'score-saber': 'beat-leader'
    return renderRemoteRank(accountId, remoteP, renderOpts as RemoteRenderOpts)
  }
  if(platform == Platform.BL) {
    const {scores, userInfo} = await api.BeatLeader.getPlayerScoresWithUserInfo(accountId)
    return renderBLPlayerImg(renderOpts.puppeteer, scores, userInfo, renderOpts.onStartRender, renderOpts.onRenderError)
  }
  const {scores, userInfo}  = await api.ScoreSaber.getPlayerRecentScoreWithUserInfo(accountId)
  return renderSSPlayerImg(renderOpts.puppeteer, scores, userInfo, renderOpts.onStartRender, renderOpts.onRenderError)
}

export const renderScore = async (scoreId: string, platform: Platform, api:APIService, renderOpts:RenderOption) => {
  let remoteP =  'beat-leader'
  if(renderOpts.type == 'remote') {
    let remoteP = platform == Platform.SS ? 'score-saber': 'beat-leader'
    return renderRemoteScore(scoreId, remoteP, renderOpts as RemoteRenderOpts)
  }
  const {score, statistic, bsor, bsMap} = await api.BeatLeader
    .withRetry(3)
    .onRetry((times, e)=>{
      console.log(`retrying ${times} due to ${e}`)
    })
    .getScoreAndBSMapByScoreId(scoreId)
    .catch(e=> {
      throw Error('渲染错误')
    })
  const qrcodeUrl = await createQrcode(`https://replay.beatleader.xyz/?scoreId=${score.id}`)
  return renderBLScoreImg(renderOpts.puppeteer, score, bsMap, statistic, bsor, qrcodeUrl, renderOpts.onStartRender, renderOpts.onRenderError)
}

export const renderMap = async (bsMap: BSMap, renderOpts:RenderOption) => {
  if (renderOpts.type == 'remote') {
    for (let i = 0; i < 3; i++) {
      const image = await renderRemoteMap(bsMap.id, renderOpts as RemoteRenderOpts)
      if (image) {
        return image
      }
    }
  }
  const previewQrUrl = await createQrcode(`https://allpoland.github.io/ArcViewer/?id=${bsMap.id}`)
  const bsMapQrUrl = await createQrcode(`https://beatsaver.com/maps/${bsMap.id}`)
  return await renderBSMapImg(renderOpts.puppeteer,bsMap, bsMapQrUrl, previewQrUrl, renderOpts.onStartRender, renderOpts.onRenderError)
}
