
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
      [key: string]: any,
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
      score: number,
      reviews?: number,
      [key: string]: any,
    },
    automapper: boolean,
    versions: {
      hash: string,
      state: string,
      createdAt: string,
      downloadURL: string,
      coverURL: string,
      previewURL: string,
      sageScore?: number,
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
        [key: string]: any
      }[]
    }[],
    lastPublishedAt: string,
    updatedAt: string,
    createdAt: string,
    tags: string[],
    ranked?: boolean,
    blRanked?: boolean,
    [key: string]: any
  }
