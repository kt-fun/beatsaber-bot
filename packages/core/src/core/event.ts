import {Logger} from "@/core/logger";
import { AgentService, PassiveSession } from "@/core/session";


export type EventHandlerCtx<Service, Config> = {
  config: Config
  logger: Logger
  services: Service
  agentService: AgentService
}

export type CmdHandlerCtx<Service, Config> = {
  config: Config
  logger: Logger
  services: Service
  session: PassiveSession
}
