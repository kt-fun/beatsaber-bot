import { BarChart } from 'lucide-react'
import { diffConv } from '@/components/utils'
import {BLStar} from "./icons/blstar";
import {SSStar} from "./icons/ssstar";

export function RankDifficulty({
  difficulty,
  star,
  blStar,
  current,
}: {
  difficulty: string
  star: number | undefined
  blStar: number | undefined
  current: boolean
}) {
  return (
    <div className={`p-2 rounded-lg bs-bg-gradient  ${current ? `gradient-border opacity-100` : 'opacity-60'} `}>
      <div className={'flex items-center gap-2'}>
        <span><BarChart className={'w-4 h-4'} /></span>
        <span>{diffConv(difficulty)}</span>
      </div>
      {star && (
        <div className={'flex items-center gap-2'}>
          <span><SSStar className={'w-4 h-4'} /></span>
          <span>{star?.toFixed(2) ?? 'none'}</span>
        </div>
      )}
      {blStar && (
        <div className={'flex items-center gap-2'}>
          <span><BLStar className={'w-4 h-4'} /></span>
          <span>{blStar?.toFixed(2) ?? 'none'}</span>
        </div>
      )}
    </div>
  )
}
