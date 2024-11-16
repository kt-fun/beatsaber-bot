export * from './ws'
export * from './bsmap'
export * from './resp'
export * from './user'
export * from './alert'

import { BSUserResponse } from './user'

export type BSUserResp = BSUserResponse | BSErrorResponse

export interface BSErrorResponse {
  success?: boolean
  errors?: string
}
