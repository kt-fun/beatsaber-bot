import Puppeteer from "koishi-plugin-puppeteer";

export * from './bsmap'
export * from './rank'
export * from './bl-score'


export interface RenderOpts {
  puppeteer: Puppeteer,
  renderBaseURL: string,
  platform: 'score-saber' | 'beat-leader',
  onStartRender?: () => void,
  background: string,
  waitTimeout?: number,
}
