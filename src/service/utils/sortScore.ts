import {Leaderboard, Score} from "../../types/beatleader";


const difficulties = {
  "Easy": 0,
  "Normal": 1,
  "Hard": 2,
  "Expert": 3,
  "ExpertPlus": 4
}

const modes = {
  "Legacy": 0,
  "Lawless": 1,
  "Lightshow": 2,
  "360Degree": 3,
  "90Degree": 4,
  "NoArrows": 5,
  "OneSaber": 6,
  "Standard": 7
}

export function sortScore(a:Leaderboard, b:Leaderboard) {

  let res = modes[b.difficulty.modeName] - modes[a.difficulty.modeName]
  if(res == 0) {
    res = difficulties[b.difficulty.difficultyName] - difficulties[a.difficulty.difficultyName]
  }
  return res
}
