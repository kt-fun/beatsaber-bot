export interface Logger {
  info(msg: string, ...args): void
  warn(msg: string, ...args): void
  error(msg: string, ...args): void
  debug(msg: string, ...args): void
}
