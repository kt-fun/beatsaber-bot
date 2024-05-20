import {Command, Context, Logger} from "koishi";
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
export * from './help'
export * from './bind'
export * from './subscribe'
export default class Cmd {
  private readonly config: Config;
  private readonly ctx: Context;
  private readonly service:APIService;
  private readonly logger:Logger;
  private cmds: Record<string, Command> = {};
  constructor(ctx:Context,config:Config) {
    this.config = config
    this.ctx = ctx
    this.service = new APIService(ctx,config)
    this.logger = this.ctx.logger('beatsaber-bot.cmds')
  }
  apply(fc:(ctx:Context,cfg:Config, apiService:APIService, logger:Logger)=>{
    key: string,
    cmd: Command
  }) {
    let cmd = fc(this.ctx,this.config, this.service,this.logger)
    let res = this.cmds[cmd.key]
    if(res) {
      let previous = this.cmds[cmd.key]
      this.logger.warn(`命令 ${cmd.key} 正在被重复初始化，先前的重名命令会被覆盖：${previous.name}`)
      previous.dispose()
    }
    this.cmds[cmd.key] = cmd.cmd
    return this
  }
}
