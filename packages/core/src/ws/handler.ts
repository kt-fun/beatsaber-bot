export interface WSHandler {
  wsUrl: string
  onOpen?: () => void
  onClose?: () => void
  onEvent?: (event: any) => void
}
