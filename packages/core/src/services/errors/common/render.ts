import {BizError} from "@/core";

export class ImageRenderError extends BizError {
  static id = 'common.render.error'
  id = ImageRenderError.id
  constructor(params?: any) {
    super()
    this.params = params
  }
}
