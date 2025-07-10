import {DB} from "@/interface/db";
import {APIService, RenderService} from "@/services";
import {CommandBuilder as _CommandBuilder, CmdContext as _CmdContext, Command as _Command} from "@/core";
import { EventHandlerCtx as _EventCtx } from "@/core/event";
import {Config} from "@/config";
import {S3Service} from "@/common/s3";
import {I18nService} from "@/common/i18n";
import type {LRUCache} from "lru-cache";
export * from './db'

export type Services = {
  db: DB,
  render: RenderService,
  api: APIService,
  i18n: I18nService,
  s3: S3Service
  cache: LRUCache<{},{}>
}

export class CommandBuilder< OPT = unknown> extends _CommandBuilder<Services, Config, OPT> {
}

export type CmdContext<O = unknown> = _CmdContext<Services, Config, O>
export type EventContext<DATA = unknown> = _EventCtx<Services, Config, DATA>
export type Command<O = unknown> = _Command<Services, Config, O>
export * from '@/core/session'
