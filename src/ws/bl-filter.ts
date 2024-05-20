import {BeatLeaderWSEvent} from "../types/ws/beatleader";
import {BLScoreFilter} from "../types/beatleader-condition";


type FilterFC = (event:BeatLeaderWSEvent,...args:any[]) => boolean


const filterMap:Record<string, FilterFC> = {
  'rank-only': RankOnly,
  'huge-improve': HugeImprove,
  'high-stars': HighStar,
  'standard': StandardMode,
  'high-pp': HighPP,
  'top-score': TopScore,
  'fc-only': FullComboOnly,
}

function RankOnly(event:BeatLeaderWSEvent) {
  return event.pp != 0
}

function FullComboOnly(event:BeatLeaderWSEvent) {
  return event.fullCombo
}


function HugeImprove(event:BeatLeaderWSEvent, ppImprovePercent: number) {
  event.scoreImprovement.pp
  return event.rankVoting != null
}

function HighStar(event:BeatLeaderWSEvent, stars: number) {
  return event.leaderboard.difficulty.stars >= stars
}

function StandardMode (event:BeatLeaderWSEvent) {
  return event.leaderboard.difficulty.modeName === "Standard"
}

function HighPP(event:BeatLeaderWSEvent, minPP: number) {
  return event.pp > minPP
}

function TopScore(event:BeatLeaderWSEvent, minTop: number) {
  return event.rank != 0  && event.rank <= minTop
}


export function BeatLeaderFilter(event:BeatLeaderWSEvent,...filters:BLScoreFilter[]) {
  for(const filter of filters) {
    const fc = filterMap[filter.filterName]
    if(fc) {
      try {
        if(fc.length - 1 > filter.filterParams.length) {
          continue
        }
        const res = fc(event, ...filter.filterParams)
        if(!res) return false
      }catch (e) {

      }
    }
  }
  return true
}
