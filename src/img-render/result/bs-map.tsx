/** @jsxImportSource react */
import React from "react";
import {BSMap} from "../../types";
import RankIcon from "../components/icons/RankIcon";
import {Calendar, Clock, Gauge, HeartPulse, Key, Star, ThumbsDown, ThumbsUp} from "lucide-react";
import dayjs from "dayjs";
import {diffConv, formatNumber, formatTime, getTag} from "../utils";
import {getMods} from "../utils/getMods";
import Progressbar from "../components/progressbar";
import {CharacteristicIcon} from "../components/characteristic";




interface BSMapProps {
  bsMap: BSMap,
  previewQrUrl: string,
  bsMapQrUrl: string,
}


export default function BSMapShare(
{
  bsMap,
  bsMapQrUrl,
  previewQrUrl,
}:BSMapProps
){
  // if ranked fetch rank star
  const bg = "https://www.loliapi.com/acg/pe/"
  return(
    <>
      <div
        className={"w-[400px] rounded-none flex flex-col relative h-auto  my-auto"}
        id="render-result"
      >
        <div className={"relative z-10"}>
          <div className={"bg-blend-darken bg-black/[.8] text-white  rounded-none"}>
            <img src={bsMap.versions[0].coverURL} className="w-[400px]" loading={"eager"} alt={"bsmap cover"}/>
            <div className="flex w-full h-auto flex-col">
              <div className="p-4">
                <div className="text-ellipsis  line-clamp-2">
                <span
                  className="text-ellipsis  line-clamp-2 text-xl font-weight bg-gradient-to-r bg-clip-text text-transparent from-red-300 to-blue-300">
                {bsMap.name}
                </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="author flex space-x-4 items-center ">
                    <img src={bsMap.uploader.avatar} className="rounded-full w-8 h-8" loading={"eager"} alt={"bsmap mapper avatar"}/>
                    <span className="text-xl">{bsMap.uploader.name}</span>
                  </div>
                </div>

                <div className="meta  flex space-x-4 text-xs py-2 items-center">
                  <RankIcon blrank={bsMap.blRanked} ssrank={bsMap.ranked}/>
                  <div className="flex space-x-1 items-center justify-between">
                    <HeartPulse className="w-3 h-3"/>
                    <span>{bsMap.metadata.bpm.toFixed(0)}</span>
                  </div>
                  <div className="flex space-x-1 items-center justify-between">
                    <Clock className="w-3 h-3"/>
                    <span>{dayjs.duration(bsMap.metadata.duration, 'seconds').format('mm:ss')}</span>
                  </div>

                  <div className="flex space-x-1 items-center justify-between">
                    <Key className="w-3 h-3"/>
                    <span
                      className="font-weight bg-gradient-to-r bg-clip-text text-transparent from-red-300 to-blue-300">
                    {bsMap.id}
                  </span>
                  </div>
                  <div className="flex space-x-2 text-xs">
                    <span>
                      <Calendar className="h-3 w-3"/>
                    </span>
                    <span>{formatTime(bsMap.lastPublishedAt)}</span>
                  </div>
                </div>

                <div className="tags flex flex-wrap justify-start">
                  {
                    bsMap.tags?.sort(((a, b) => b.length - a.length))
                      ?.map(item => (
                        <span className="text-xs mx-1 text-white bg-red-500 rounded px-1"
                              key={item}>{getTag(item)}</span>
                      ))
                  }
                </div>
                <div className="tags flex flex-wrap justify-start pt-2">
                  {
                    getMods(bsMap)?.sort(((a, b) => b.length - a.length))
                      ?.map(item => (
                        <span className="text-xs mx-1 text-white bg-blue-500 rounded px-1" key={item}>{item}</span>
                      ))
                  }
                </div>
                <div className="flex space-x-2">
                  <div className="percentage w-42 py-2 flex text-xs items-center space-x-4">
                    <Progressbar value={bsMap.stats.score * 100}/>
                    <span>{(bsMap.stats.score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex space-x-1 items-center text-xs">
                    <span>
                      <ThumbsUp className="h-3 w-3"/>
                    </span>
                    <span>{formatNumber(bsMap.stats.upvotes)}</span>
                  </div>
                  <div className="flex space-x-1 items-center text-xs">
                    <span>
                      <ThumbsDown className="h-3 w-3"/>
                    </span>
                    <span>{formatNumber(bsMap.stats.downvotes)}</span>
                  </div>
                </div>

                <span className="font-bold">难度</span>
                <div className="grid grid-cols-2">
                  {
                    bsMap.versions[0].diffs.map(diff => (
                      <div key={diff.difficulty + diff.characteristic} className="text-xs space-x-1 flex items-center">
                        <span className="h-3 w-3 shrink-0"><CharacteristicIcon characteristic={diff.characteristic}/></span>
                        <span>{diffConv(diff.difficulty)}</span>
                        <span>
                          <Gauge className={'w-3 h-3 ml-1'}/>
                        </span>
                        <span>{(diff.nps).toFixed(2)}</span>
                        {
                          diff.stars && (
                            <>
                              <span>
                                <Star className={'w-3 h-3 ml-1'}/>
                              </span>
                              <span>{(diff.stars)?.toFixed(2)}</span>
                            </>
                          )
                        }
                      </div>
                    ))
                  }
                </div>

                <span className="font-bold">描述</span>
                <p className="text-xs">
                  {bsMap.description}
                </p>

                <div className={'flex items-center justify-between pt-2'}>
                  <div className={'text-[10px] text-opacity-70 text-slate-100 align-bottom mt-auto mb-0'}>
                    Powered by BSBot
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={'flex flex-col items-center'}>
                      <img width={80} height={80} src={bsMapQrUrl} className="w-20 h-20"/>
                      {/*<QRCode url={`https://beatsaver.com/maps/${bsMap.id}`} classNameame={'w-20'}/>*/}
                      <div className={"text-[8px] font-light"}>beatsaver</div>
                    </div>
                    <div className={'flex flex-col items-center'}>
                      <img width={80} height={80} src={previewQrUrl} className="w-20 h-20"/>
                      {/*<QRCode url={`https://allpoland.github.io/ArcViewer/?id=${bsMap.id}`} className={'w-20'}/>*/}
                      <div className={"text-[8px] font-light"}>preview</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <img src={bg} className={'inset-0 absolute h-full object-cover -z-10'} loading={'eager'} alt={"random background img"}/>
        </div>
      </div>
    </>
  )
}
