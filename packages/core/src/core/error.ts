export class BizError extends Error {
  id: string
  code: string
  layer?: string
  params?: any
}
