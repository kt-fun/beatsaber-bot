import {BSMap} from "./bsmap";

export interface BeatSaverWSEvent {
  type: "MAP_UPDATE" | "MAP_DELETE",
  msg: BSMap
}
