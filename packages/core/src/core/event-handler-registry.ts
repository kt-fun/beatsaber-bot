import {EventHandlerCtx} from "./event";
import {Logger} from "@/core/logger";


type EventHandler<Service = unknown, Config = unknown, T = unknown> = {
  type: string,
  handlerId: string
  handler: (ctx: EventHandlerCtx<Service, Config, T>) => Promise<void>
  enabled?: boolean
}

type Event<T> = {
  type?: string,
  handlerId: string,
  data: T
  ctx?: {
    logger?: Logger,
  }
}

type Ctx = Pick<EventHandlerCtx<unknown, unknown, unknown>, 'config' | 'services' | 'agentService'>

export class EventHandlerRegistry {
  private handlers: EventHandler[] = []
  constructor(handlers: EventHandler[], private ctx: Ctx) {
    this.handlers = handlers
  }

  public getHandlersByType<T extends  EventHandler = EventHandler>(type: string): T[] {
    return this.handlers.filter(
      (handler) => handler.type === type
    ) as T[]
  }

  public getHandlerById(id: string) {
    return this.handlers.find((handler) => handler.handlerId === id)
  }

  handleEvent<T>(event: Event<T>) {
    const handler = this.getHandlerById(event.handlerId)
    if(!handler) return
    return handler.handler({
      type: handler.type,
      data: event.data,
      logger: event.ctx.logger,
      ...this.ctx,
      services: this.ctx.services,
    })
  }
}
