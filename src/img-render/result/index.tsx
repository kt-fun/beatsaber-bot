/** @jsxImportSource react */
import {BSMap} from "../../types";
import {renderImg} from "../render";
import React from "react";
import BSMapShare from "./bs-map";
import SSPlayerPage from "./ss-player";
import BLPlayerPage from "./bl-player";
import Puppeteer from "koishi-plugin-puppeteer";
import { ScoreSaberUser } from "../../types/scoresaber";
import { ScoreSaberItem } from "../interface/scoresaber";
import { BeatLeaderUser } from "../interface/beatleader";
import { Score } from "../../types/beatleader";
import { BLScore } from "./bl-score";

export const renderBSMapImg = (puppeteer: Puppeteer, bsMap:BSMap, bsMapQrUrl:string, previewQrUrl:string, onStart?: ()=>void, onError?: (e?:any)=> void) => {
  return renderImg(puppeteer, <BSMapShare bsMap={bsMap} bsMapQrUrl={bsMapQrUrl} previewQrUrl={previewQrUrl}/>, onStart, onError)
}
export const renderSSPlayerImg = (puppeteer: Puppeteer, scores:ScoreSaberItem[], userInfo:ScoreSaberUser,  onStart?: ()=>void, onError?: (e?: any)=> void) => {
  return renderImg(puppeteer, <SSPlayerPage scoreUser={userInfo} leaderItems={scores}/>, onStart, onError)
}

export const renderBLPlayerImg = (puppeteer: Puppeteer, scores: Score[],userInfo:BeatLeaderUser, onStart?: ()=>void, onError?: (e?:any)=> void) => {
  return renderImg(puppeteer, <BLPlayerPage user={userInfo} beatleaderItems={scores} />, onStart, onError)
}

export const renderBLScoreImg = (puppeteer: Puppeteer,score: Score, bsMap:BSMap,statistic:any,bsor:any, qrcodeUrl:string, onStart?: ()=>void, onError?: (e?:any)=> void) => {
  return renderImg(puppeteer, <BLScore score={score} bsMap={bsMap} statistic={statistic} bsor={bsor} qrcodeUrl={qrcodeUrl}/>, onStart, onError)
}
