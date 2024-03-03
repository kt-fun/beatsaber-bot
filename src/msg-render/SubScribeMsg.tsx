import {BSMap} from "../types";
import {BSMapItem as Item} from "./MapItem";
import {Session} from "koishi";


export function SubScribeUpdateMsg(
{
  bsmap
}:{
  bsmap:BSMap
}) {
  <>
    <message>
      <p>
        Hello, 你关注的谱师 {bsmap.uploader.name} 更新啦！<br/>
        <Item item={bsmap}/>
      </p>
    </message>
  </>
}


export function SubScribeMsg(
{
  session,
  userInfos
}:{
  session:Session,
  userInfos: {
    bsUserId: string,
    bsUsername: string
  }[]
}){
  return <>
        {session.text('commands.bsbot.subscribe.success')}
        {
          userInfos.map(item =>
            <p>{item.bsUserId}:{item.bsUsername}</p>
          )
        }
        {session.text('commands.bsbot.subscribe.notify')}
  </>
}
