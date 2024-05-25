
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
    },
    metadata: {
      bpm:number,
      duration: number,
      songName: string,
      songSubName: string,
      songAuthorName: string,
      levelAuthorName: string,
    },
    stats: {
      plays: number,
      downloads: number,
      upvotes: number,
      downvotes: number,
      score: number
    },
    automapper: boolean,
    versions: {
      hash: string,
      state: string,
      createdAt: string,
      downloadURL: string,
      coverURL: string,
      previewURL: string,
      diffs: {
        notes: number,
        bombs: number,
        offset: number,
        obstacles: number,
        nps: number,
        length: number,
        characteristic: string,
        difficulty: string,
        events: string,
        chroma: boolean,
        me: boolean,
        ne: boolean,
        cinema: boolean,
        seconds: number,
        maxScore: string,
        paritySummary: any,
        [key: string]: any
      }[]
    }[],
    lastPublishedAt: string,
    updatedAt: string,
    createdAt: string,
    tags: string[],
    ranked: boolean,
    blRanked: boolean,
    [key: string]: any
  }