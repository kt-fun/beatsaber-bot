export abstract class BizError extends Error {
  static id: string
  code: string
  params?: any
  id: string
}
