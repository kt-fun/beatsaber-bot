interface BeatleaderConditionItem {
  minAcc: number;
  maxMissedNote: number;
  rankOnly: number;
  maxBadCut: number;
  noPause: boolean;
  enable: boolean;
}



type BLFilterName = ''


interface BeatLeaderFilterItem {
  funcKey: BLFilterName
  params: any[]
  enable: boolean;
}


export interface BLScoreFilter {
  filterName: string,
  filterParams: any[]
}
