import { BSMap } from './bsmap'

// export interface BeatSaverWSEvent {
//   type: 'MAP_UPDATE' | 'MAP_DELETE'
//   msg: BSMap
// }

interface DeleteEvent {
  type: 'MAP_DELETE'
  msg: string
}

interface UpdateEvent {
  type: 'MAP_UPDATE'
  msg: BSMap
}

export type BeatSaverWSEvent = DeleteEvent | UpdateEvent
