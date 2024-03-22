import {blRequest} from "./blRequset";
import {bsRequest} from "./bsRequest";
import {scRequest} from "./scRequest";

export type BeatLeaderClient = ReturnType<typeof blRequest>
export type BeatSaverClient = ReturnType<typeof bsRequest>
export type ScoreSaberClient = ReturnType<typeof scRequest>

export * from './scRequest'

export * from './blRequset'

export * from './bsRequest'
