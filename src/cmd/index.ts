import {Context} from "koishi";
import {Config} from "../config";

export * from './bind'
export * from './key-search'
export * from './id-search'
export * from './subscribe'
export * from './unsubscribe'
export * from './latest'
export * from './rank'
export * from './me'
export * from './whois'
export default class Cmd {
  private config;
  private ctx;
  constructor(ctx:Context,config:Config) {
    this.config = config
    this.ctx = ctx
  }
  apply(fc:(Context,Config)=>void) {
    fc(this.ctx,this.config)
    return this
  }
}
