/** @jsxImportSource react */
import { ScoreSaberItem } from '../interfaces'
import { BarChart, Key, Star, Wrench } from 'lucide-react'

const diffConv = (diff: string) => {
  if (diff.includes('ExpertPlus')) {
    return 'E+'
  } else if (diff.includes('Expert')) {
    return 'EX'
  } else if (diff.includes('Hard')) {
    return 'H'
  } else if (diff.includes('Normal')) {
    return 'N'
  }
  return 'E'
}
const getModifiers = (modifiers: string) => {
  return modifiers ? modifiers.split(',') : []
}
export default function ScoreItem({
  scoreItem,
}: {
  scoreItem: ScoreSaberItem
}) {
  return (
    <div className={'relative'}>
      <div
        className={
          'rounded-lg flex bg-black/[.4] space-x-2  backdrop-blur-md overflow-hidden'
        }
      >
        <img
          loading={'eager'}
          src={scoreItem.leaderboard.coverImage}
          className={'rounded-md h-20 w-20'}
        />
        <div className={'flex flex-col space-y-1 py-0.5'}>
          <div
            className={
              'font-semibold text-xs text-ellipsis overflow-hidden line-clamp-1 break-all'
            }
          >
            {scoreItem.leaderboard.songName}
          </div>
          <div
            className={
              'text-xs flex items-center space-x-2 *:flex *:items-center *:space-x-1 '
            }
          >
            <div>
              <span>
                <BarChart className={'w-3 h-3'} />
              </span>
              <span>
                {diffConv(scoreItem.leaderboard.difficulty.difficultyRaw)}
              </span>
            </div>
            <div>
              <span>
                <Star className={'w-3 h-3'} />
              </span>
              <span>{scoreItem.leaderboard.stars} </span>
            </div>
            <div>
              <span>
                <Key className={'w-3 h-3'} />
              </span>
              <span>{scoreItem.mapId ?? 'unknown'}</span>
            </div>
          </div>
          <div className={'flex space-x-2 text-xs'}>
            <span>
              {(
                (scoreItem.score.baseScore / scoreItem.leaderboard.maxScore) *
                100
              ).toFixed(2)}
              %
            </span>
            <span className={'text-orange-200'}>
              {scoreItem.score.pp.toFixed(1)}
              PP
            </span>
          </div>
          {getModifiers(scoreItem.score.modifiers).length > 0 && (
            <div className="text-xs flex flex-wrap space-x-2 items-center">
              <Wrench className="h-3 w-3" />
              {getModifiers(scoreItem.score.modifiers).map((modifier) => (
                <span key={modifier}>{modifier}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="absolute right-1 bottom-1 text-white flex text-xs space-x-1 items-center">
        {scoreItem.score.fullCombo && (
          <span className="from-blue-300 to-red-300 bg-gradient-to-r bg-clip-text text-transparent">
            FC
          </span>
        )}
      </div>
    </div>
  )
}
