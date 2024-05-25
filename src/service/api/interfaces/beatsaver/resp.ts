import {BSMap} from "./bsmap";

export interface HashResponse {
  [hash: string] : BSMap
}

export type HashReqResponse = BSMap | HashResponse;

export interface BSMapLatestResponse {
  docs: BSMap[]
}
