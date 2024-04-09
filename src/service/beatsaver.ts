import {BeatLeaderClient, BeatSaverClient} from "./api";

export const BeatSaverService = (
  bsClient:BeatSaverClient,
)=>{
  return {
    ...bsClient,
    // beatsaver:
  }
}
