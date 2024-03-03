import {BSMapItem as Item} from "./MapItem";
import {BSMap} from "../types";

export function FollowUpdate(
{
  bsmap
}:{
  bsmap:BSMap
}
) {
  <>
    <message>
      <p>
        Hello, 你关注的谱师 {bsmap.uploader.name} 更新啦！<br/>
        <Item item={bsmap}/>
      </p>
    </message>
  </>
}
