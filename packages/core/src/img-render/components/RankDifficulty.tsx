import { BarChart, Star } from 'lucide-react'
import { diffConv } from '@/img-render/utils'

export function RankDifficulty({
  difficulty,
  stars,
  current,
}: {
  difficulty: string
  stars: number
  current: boolean
}) {
  return (
    <div
      className={`p-2 rounded-lg bs-bg-gradient  ${current ? `gradient-border opacity-100` : 'opacity-60'} `}
    >
      <div className={'flex items-center gap-2'}>
        <span>
          <BarChart className={'w-4 h-4'} />
        </span>
        <span>{diffConv(difficulty)}</span>
      </div>
      <div className={'flex items-center gap-2'}>
        <span>
          <Star className={'w-4 h-4'} />
        </span>
        <span>{stars?.toFixed(2) ?? 'none'} </span>
      </div>
    </div>
  )
}
