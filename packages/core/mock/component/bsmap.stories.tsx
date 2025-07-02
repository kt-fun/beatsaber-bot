// @ts-ignore
import BSMap from '../../src/components/pages/bs-map'
import { bsmap } from '../bsmap'
import { bsMapQrUrl, previewQrUrl } from '../qr'
export default {
  component: BSMap,
}

export const BSMapStory = {
  args: {
    bsMap: bsmap,
    bsMapQrUrl: bsMapQrUrl,
    previewQrUrl: previewQrUrl,
  },
}
