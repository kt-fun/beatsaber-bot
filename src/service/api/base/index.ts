import {blRequest} from "./blRequset";
import {bsRequest} from "./bsRequest";
import {scRequest} from "./scRequest";
import {aioRequest} from "./aioRequest";

export type BeatLeaderClient = ReturnType<typeof blRequest>
export type BeatSaverClient = ReturnType<typeof bsRequest>
export type ScoreSaberClient = ReturnType<typeof scRequest>

export type AIOSaberClient = ReturnType<typeof aioRequest>
export * from './scRequest'

export * from './blRequset'

export * from './aioRequest'

export * from './bsRequest'
