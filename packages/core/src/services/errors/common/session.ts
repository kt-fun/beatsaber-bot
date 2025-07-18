
// cmd error
import {BizError} from "@/core";

export class SessionPromotionTimeoutError extends BizError {
  static id = 'common.session.promotion.timeout'
  name = 'SessionPromotionTimeoutError'
  id = SessionPromotionTimeoutError.id
  constructor(params?: any) {
    super()
    this.params = params
  }
}

export class SessionPromotionCancelError extends BizError {
  static id = 'common.session.promotion.cancel'
  name = 'SessionPromotionCancelError'
  id = SessionPromotionCancelError.id
  constructor(params?: any) {
    super()
    this.params = params
  }
}
