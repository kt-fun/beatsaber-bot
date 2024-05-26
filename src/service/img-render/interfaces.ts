import Puppeteer from "koishi-plugin-puppeteer";

export * from '../../types/api'
export * from '../../types/api'

interface BaseRenderOpts {
  type: 'local'|'remote'
  puppeteer: Puppeteer,
  onRenderStart?: ()=> void,
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
