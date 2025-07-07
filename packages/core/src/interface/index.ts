import {DB} from "@/interface/db";
import {APIService, I18nService, RenderService} from "@/services";
import {CommandBuilder as _CommandBuilder, CmdContext as _CmdContext, Command as _Command} from "@/core";
import {Config} from "@/config";
import {S3Service} from "@/common/s3";
export * from './db'

export type Services = {
  db: DB,
  api: APIService,
  render: RenderService,
  i18n: I18nService,
  s3: S3Service
}

export class CommandBuilder<T, OPT = unknown> extends _CommandBuilder<Services, Config, OPT> {
  // static create(name: string) {
  //   return _CommandBuilder.create<Services<any>, Config, {}>(name)
  // }
}

export type CmdContext<O = unknown> = _CmdContext<Services, Config, O>

export type Command<O = unknown> = _Command<Services, Config, O>
export * from '@/core/session'
