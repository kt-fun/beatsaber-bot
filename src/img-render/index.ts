import {Component} from "@vue/runtime-core";
import {createSSRApp} from "vue";
import {renderToString as rts} from "@vue/server-renderer";
import Puppeteer from "koishi-plugin-puppeteer";

export * from './bsmap'
export * from './rank'
export * from './bl-score'


export interface RenderOpts {
  puppeteer: Puppeteer,
  renderBaseURL: string,
  platform: 'score-saber' | 'beat-leader',
  onStartRender?: () => void,
  background: string
}
