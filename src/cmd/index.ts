import {Context, Logger} from "koishi";
import {Config} from "../config";
import {APIService} from "../service";

export * from './key-search'
export * from './id-search'
export * from './latest'
export * from './rank'
export * from './me'
export * from './whois'
export * from './cmp'
export * from './score'
export * from './bind-steam'
export * from './bind-beatsaver'
export * from './subscribe/index'
export default class Cmd {
  private readonly config: Config;
  private readonly ctx: Context;
  private readonly service:APIService;
  private readonly logger:Logger;
  private cmds: [];
  constructor(ctx:Context,config:Config) {
    this.config = config
    this.ctx = ctx
    this.service = new APIService(ctx,config)
    this.logger = this.ctx.logger('beatsaber-bot.cmds')
  }
  apply(fc:(ctx:Context,cfg:Config, apiService:APIService, logger:Logger)=>void) {
    fc(this.ctx,this.config, this.service,this.logger)
    return this
  }
}
