/** @jsxImportSource react */
import BeatLeaderIcon from './BeatLeader'
import ScoreSaberIcon from './ScoreSaberIcon'

export default function RankIcon({
  blrank,
  ssrank,
}: {
  blrank: boolean
  ssrank: boolean
}) {
  return (
    <div className={'flex space-x-1 justify-center items-center'}>
      {blrank && <BeatLeaderIcon className={'w-5 h-5'} />}
      {ssrank && <ScoreSaberIcon className={'w-4 h-4'} />}
    </div>
  )
}
