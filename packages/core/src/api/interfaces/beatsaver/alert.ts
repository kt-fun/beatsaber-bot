export interface BeatsaverAlertStats {
  unread: number
  read: number
  byTape: {
    MapRelease: number
    MapCurated: number
  }
  curationAlerts: boolean
  reviewAlerts: boolean
  followAlerts: boolean
}

export interface BeatsaverAlert {
  id: number
  head: string
  body: string
  time: string
  type: string
}
