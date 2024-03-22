import {Context} from "koishi";
import {Config} from "../config";
import {APIService} from "../service";

export * from './bind'
export * from './key-search'
export * from './id-search'
export * from './subscribe'
export * from './unsubscribe'
export * from './latest'
export * from './rank'
export * from './me'
export * from './whois'
export * from './cmp'
export * from './score'
export default class Cmd {
  private readonly config: Config;
  private readonly ctx: Context;
  private readonly service:APIService;
  constructor(ctx:Context,config:Config) {
    this.config = config
    this.ctx = ctx
    this.service = new APIService(ctx,config)
  }
  apply(fc:(Context,Config, APIService)=>void) {
    fc(this.ctx,this.config, this.service)
    return this
  }
}
