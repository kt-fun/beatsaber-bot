import {Logger} from "@/core/logger";
import { AgentService } from "@/core/session";

export type EventHandlerCtx<Service, Config, DATA> = {
  type: string;
  config: Config
  logger: Logger
  services: Service
  agentService: AgentService
  data: DATA
}
