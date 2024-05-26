export interface BSOR {
  frames: BSORFrame[]
  heights: BSORHeight[]
  info: BSORInfo
  notes: BSORNote[]
  pauses: BSORPauses[]
  walls: BSORWall[]
}

interface position {
  x: number
  y: number
  z: number
}
interface rotation {
  w: number
  x: number
  y: number
  z: number
}

interface Pos {
  position: position
  rotation: rotation
}

interface BSORFrame {
  fps: number
  head: Pos
  left: Pos
  right: Pos
  time: number
}

type BSORHeight = {
  [key: string]: any
}

interface BSORInfo {
  controller: string
  difficulty: string
  environment: string
  failTime: number
  gameVersion: string
  hash: string
  height: number
  hmd: string
  jumpDistance: string
  leftHanded: boolean
  mapper: string
  mode: string
  modifiers: string
  platform: string
  playerID: string
  playerName: string
  score: number
  songName: string
  speed: number
  startTime: number
  timestamp: string
  trackingSysytem: string
  version: string
  [key: string]: any
}

export interface BSORNote {
  eventTime: number
  eventType: number
  noteCutInfo: NoteCutInfo
  noteID: number
  spawnTime: number
  [key: string]: any
}

interface BSORPauses {
  duration: any
  time: number
  [key: string]: any
}

interface BSORWall {
  [key: string]: any
}

export interface NoteCutInfo {
  afterCutRating: number
  beforeCutRating: number
  cutAngle: number
  cutDirDeviation: number
  cutDistanceToCenter: number
  cutNormal: CutNormal
  cutPoint: CutPoint
  directionOK: boolean
  saberDir: SaberDir
  saberSpeed: number
  saberType: number
  saberTypeOK: boolean
  speedOK: boolean
  timeDeviation: number
  wasCutTooSoon: boolean
  [property: string]: any
}

export interface CutNormal {
  x: number
  y: number
  z: number
  [property: string]: any
}

export interface CutPoint {
  x: number
  y: number
  z: number
  [property: string]: any
}

export interface SaberDir {
  x: number
  y: number
  z: number
  [property: string]: any
}
