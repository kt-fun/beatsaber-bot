/** @jsxImportSource react */
import { Score } from "../interfaces";
import {BarChart, Key, Pin, Star, Wrench} from "lucide-react";
import {diffConv} from "../utils";



const getModifiers = (modifiers:string)=> {
  return modifiers?modifiers.split(','):[]
}

export default function BeatLeaderItem(
{
  item
}:{
    item: Score & {
        pinned?: boolean
    }
}
) {
  return (
    <div className="relative  overflow-hidden">
      <div className={"rounded-lg flex bg-black/[.4] space-x-2 backdrop-blur-md"}>
        <img loading={'eager'} src={item.leaderboard.song.coverImage} className={"rounded-md h-20 w-20"} alt={"score item cover"}/>
        <div className={"flex flex-col space-y-1 py-0.5"}>
          <div className={"font-semibold text-xs text-ellipsis overflow-hidden line-clamp-1 break-all"}>
            {item.leaderboard.song.name}
          </div>
          <div className={"text-xs flex items-center space-x-2 *:flex *:items-center *:space-x-1 "}>
            <div>
              <span><BarChart className={"w-3 h-3"}/></span>
              <span>{diffConv(item.leaderboard.difficulty.difficultyName)}</span>
            </div>
            <div>
              <span><Star className={"w-3 h-3"}/></span>
              <span>{item.leaderboard.difficulty.stars?.toFixed(2) ?? "none"} </span>
            </div>
            <div>
              <span><Key className={"w-3 h-3"}/></span>
              <span>{item.leaderboard.song.id.toLowerCase().replaceAll('x', '')}</span>
            </div>
          </div>
          <div className={"flex space-x-2 text-xs"}>
            <span>{(item.baseScore / item.leaderboard.difficulty.maxScore * 100).toFixed(2)}%</span>
            <span className={"text-orange-200"}>{item.pp.toFixed(1)}PP</span>
          </div>
          {
            getModifiers(item.modifiers).length > 0 &&
            (
              <div className="text-xs flex flex-wrap space-x-2 items-center">
                <Wrench className="h-3 w-3"/>
                {
                  getModifiers(item.modifiers).map(modifier => (
                    <span key={modifier}>{modifier}</span>
                  ))
                }
              </div>
            )
          }
        </div>
      </div>

      <div className="absolute right-1 bottom-1 text-white flex text-xs space-x-1 items-center">
        {
          item.fullCombo &&
            <span className="from-blue-300 to-red-300 bg-gradient-to-r bg-clip-text text-transparent">FC</span>
        }
        {
          item.pinned && <Pin className="rotate-45 h-3 w-3 my-auto"/>
        }
      </div>
    </div>

  )
}
