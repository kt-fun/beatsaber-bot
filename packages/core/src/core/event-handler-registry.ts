import {EventHandlerCtx} from "./event";


type EventHandler<Service = unknown, Config = unknown, T = unknown> = {
  type: string,
  handlerId: string
  handler: (ctx: EventHandlerCtx<Service, Config, T>) => Promise<void>
  enabled?: boolean
}

type Event<T> = {
  type: string,
  handlerId?: string,
  data: T
}

type Ctx = Pick<EventHandlerCtx<unknown, unknown, unknown>, 'config'| 'logger' | 'services' | 'agentService'>

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
    const handler = this.getHandlerById(event.type)
    if(!handler) return
    return handler.handler({
      type: handler.type,
      data: event.data,
      ...this.ctx
    })
  }
}
