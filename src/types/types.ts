
export type BSUserResp = BSUserResponse | BSErrorResponse


export interface BSErrorResponse {
  error?: string
}

export interface BSUserResponse{
  id: number
  name: string
  admin: boolean
  avatar: boolean
  curator: boolean
  description: string
}

export interface BSMapLatestResponse {
  docs: BSMap[]
}

export interface BSMap{
  id: string
  name: string,
  description: string,
  declaredAi: string,
  uploader: {
    id: number,
    name: string,
    avatar: string,
    type: string,
    [key:string]: any,
  },
  metadata: {
    bpm:number,
    duration: number,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    [key:string]: any,
  },
  stats: {
    plays: number,
    downloads: number,
    upvotes: number,
    downvotes: number,
    score: number,
    [key:string]: any,
  },
  automapper: boolean,
  versions: {
    hash: string,
    state: string,
    createdAt: string,
    downloadURL: string,
    coverURL: string,
    previewURL: string,
    [key:string]: any,
    diffs: {
      notes: number,
      bombs: number,
      offset: number,
      obstacles: number,
      nps: number,
      length: number,
      characteristic: string,
      difficulty: string,
      events: number,

      chroma: boolean,
      me: boolean,
      ne: boolean,
      cinema: boolean,
      seconds: number,
      maxScore: number,
      paritySummary: any,
      [key:string]: any,
    }[]
  }[],
  updatedAt: string,

  [key:string]: any,
  lastPublishedAt: string,
  createdAt: string,
  tags: string[],
}


export interface BeatSaverWSEvent {
  type: "MAP_UPDATE" | "MAP_DELETE",
  msg: BSMap
}
