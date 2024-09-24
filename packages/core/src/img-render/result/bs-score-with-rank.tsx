import {
  Check,
  Key,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  HeartPulse,
} from 'lucide-react'
import ScoreGraph from '../components/scoregraph'
import React from 'react'
import { BSOR, Score } from '@/api/interfaces/beatleader'
import { BSMap } from '@/api/interfaces/beatsaver'
import {
  RankScoreItem,
  ScoreItemSkeleton,
} from '@/img-render/components/rankScoreItem'
import { RankDifficulty } from '@/img-render/components/RankDifficulty'
import { Avatar } from '@/img-render/components/base/avatar'
import { formatDuration, formatTime } from '@/img-render/utils'
import Progressbar from '@/img-render/components/progressbar'

interface BLScoreProps {
  score: Score
  aroundScores: Score[]
  regionTopScores: Score[]
  bsMap: BSMap
  difficulties: any[]
  statistic: any
  bsor: BSOR
}

export default function BLRankScore({
  score,
  aroundScores,
  regionTopScores,
  difficulties,
  bsMap,
  statistic,
  bsor,
}: BLScoreProps) {
  const bg = 'https://www.loliapi.com/acg/pc/'
  let aroundScore = aroundScores
    .slice(0, 7)
    .map((it) => ({ ...it, template: false }))
  let regionTopScore = regionTopScores
    .slice(0, 7)
    .map((it) => ({ ...it, template: false }))
  if (aroundScore.length < 7) {
    aroundScore = aroundScore.concat(
      new Array(7 - aroundScore.length).fill({ template: true })
    )
  }
  if (regionTopScore.length < 7) {
    regionTopScore = regionTopScore.concat(
      new Array(7 - regionTopScore.length).fill({ template: true })
    )
  }

  return (
    <>
      <div
        className={
          'flex flex-col justify-center items-center relative h-[720px] w-[1165px] my-auto rounded-none'
        }
        id="render-result"
      >
        <div
          className={
            'bg-blend-darken h-full w-full left-auto absolute right-auto bg-black/[.6] p-4 text-white flex flex-col justify-between z-10'
          }
        >
          <div className={'flex justify-between items-start gap-2 grow'}>
            <div className="flex flex-col  items-start justify-between text-xl font-bold grow h-full">
              <div className="flex space-x-4 items-center justify-between text-2xl font-bold">
                <Avatar
                  className={'h-16 w-16 rounded-full'}
                  src={score.player.avatar}
                  fallback={score.player.name.slice(0, 1)}
                />
                <div>{score.player.name}</div>
              </div>
              <div className="text-xl text-ellipsis line-clamp-2">
                {score.song.name}
              </div>
              <div className="flex space-x-4 h-52">
                <Avatar
                  className={'h-52 w-52 rounded-md'}
                  src={score.song.cover}
                  fallback={score.song.name.slice(0, 1)}
                />
                <div className="text-xs font-bold flex flex-col items-start justify-between grow w-full">
                  <div className="flex space-x-2 items-center text-sm">
                    <Avatar
                      className={'h-4 w-4 rounded-full'}
                      src={bsMap.uploader.avatar}
                      fallback={score.song.mapper.slice(0, 1)}
                    />
                    <div className="flex items-center justify-between">
                      <div className="text-ellipsis line-clamp-1">
                        {score.song.mapper}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs flex gap-2 items-center *:space-x-1 *:flex *:items-center font-normal">
                    <div className="flex items-center">
                      <HeartPulse className="h-3 w-3" />
                      <span>{bsMap.metadata.bpm.toFixed(0)}</span>
                    </div>
                    <div>
                      <span>
                        <Key className={'w-3 h-3'} />
                      </span>
                      <span>
                        {score.song.id.toLowerCase().replaceAll('x', '')}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-3 w-3" />
                      <span>{formatDuration(bsMap.metadata.duration)}</span>
                    </div>
                    <div className="flex items-center text-ellipsis col-span-2 line-clamp-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatTime(bsMap.lastPublishedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 justify-between font-normal">
                    <Progressbar
                      value={bsMap.stats.score * 100}
                      // className="h-1.5"
                      // containerClassName="h-1.5"
                    />
                    <span>{(bsMap.stats.score * 100).toFixed(2)} %</span>
                    <div className="flex items-center">
                      <ThumbsUp className="h-3 w-3 mr-0.5" />
                      <span>{bsMap.stats.upvotes}</span>
                    </div>
                    <div className="flex items-center">
                      <ThumbsDown className="h-3 w-3 mr-0.5" />
                      <span>{bsMap.stats.downvotes}</span>
                    </div>
                  </div>
                  <div className={'text-lg min-w-60 flex flex-col leading-6'}>
                    <div className="flex justify-between items-center">
                      <span> # {score.pp.toFixed(2)} PP</span>
                      <span> # {score.rank}</span>
                    </div>
                    {
                      <div className="flex items-center justify-between">
                        <span>Accuracy</span>
                        <span>{(score.accuracy * 100).toFixed(2)} %</span>
                      </div>
                    }
                    {score.fullCombo && (
                      <div className="flex items-center justify-between">
                        <span>Full Combo</span>
                        <Check />
                      </div>
                    )}
                    {score.maxCombo && (
                      <div className="flex items-center justify-between">
                        <span>Max Combo</span>
                        <span>{score.maxCombo}</span>
                      </div>
                    )}

                    {
                      <div className="flex items-center justify-between">
                        <span>Missed Notes</span>
                        <span>{score.missedNotes}</span>
                      </div>
                    }
                    {
                      <div className="flex items-center justify-between">
                        <span>Total Mistakes</span>
                        <span>{score.missedNotes}</span>
                      </div>
                    }
                    {score.modifiers && (
                      <div className="flex items-center justify-between">
                        <span>Modifiers</span>
                        <span>{score.modifiers}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/*diff code */}
              <div className="text-xl font-bold h-24 w-[500px] rounded-lg  mt-auto flex items-center justify-evenly gap-2 ">
                {difficulties
                  .filter((it: any) => it.mode === 1)
                  .map((diff: any) => (
                    <RankDifficulty
                      difficulty={diff.difficultyName}
                      stars={diff.stars}
                      current={score.difficulty.id === diff.id}
                      key={diff.difficultyName}
                    />
                  ))}
              </div>

              {/*acc graph*/}
              <div className="align-end mt-2 mb-2">
                <span className="text-xl font-bold">AccGraph</span>
                <ScoreGraph
                  scoreId={score.id}
                  scoreInfo={score}
                  statistic={statistic}
                  bsor={bsor}
                  height={240}
                  width={480}
                />
                {/*<ScoreGraph scoreId={score.id} scoreInfo={score} />*/}
              </div>
            </div>
            <div className={'flex justify-between gap-2 items-start mt-auto'}>
              <div className={'flex flex-col items-start gap-2'}>
                <div className={'text-white font-bold text-3xl mr-auto'}>
                  Global Rank
                </div>
                {aroundScore.map((cur: any, idx) =>
                  !cur.template ? (
                    <RankScoreItem
                      key={cur.id}
                      name={cur.player.name}
                      date={cur.timepost}
                      countryCode={cur.player.country ?? 'CN'}
                      avatar={cur.player.avatar}
                      globalRank={cur.rank}
                      score={cur.modifiedScore}
                      modifiers={cur.modifiers}
                      isRegionRank={false}
                      acc={cur.accuracy}
                      pp={cur.pp}
                      self={cur.player.id === score.playerId}
                    />
                  ) : (
                    <ScoreItemSkeleton isRegionRank={false} key={idx} />
                  )
                )}
              </div>
              <div className={'flex flex-col items-start gap-2'}>
                <div className={'text-white font-bold text-3xl mr-auto'}>
                  Region Top Rank
                </div>
                {regionTopScore.map((cur: any, idx) =>
                  !cur.template ? (
                    <RankScoreItem
                      key={cur.id}
                      name={cur.player.name}
                      date={cur.timepost}
                      countryCode={cur.player.country ?? 'CN'}
                      avatar={cur.player.avatar}
                      globalRank={cur.rank}
                      score={cur.modifiedScore}
                      modifiers={cur.modifiers}
                      isRegionRank
                      acc={cur.accuracy}
                      pp={cur.pp}
                      self={cur.player.id === score.playerId}
                    />
                  ) : (
                    <ScoreItemSkeleton isRegionRank key={idx} />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        <img
          src={bg}
          className={'inset-0 rounded-lg absolute h-full object-cover w-full'}
          loading={'eager'}
        />
      </div>
    </>
  )
}
