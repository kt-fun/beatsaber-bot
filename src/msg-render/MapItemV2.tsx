import {BSMap} from "../types";

export function BSMapItemV2(
{
  bsmap
}:{
  bsmap:BSMap
}
) {
  console.log(bsmap)
  const uploader = bsmap["uploader"]["name"]
  const curator = bsmap["curator"]
  let description = bsmap["description"]
  if(description.length >= 37) {
    description = description.slice(0,37)+"..."
  }
  let tags = bsmap["tags"]
  let tagstr = tags?.map(item=>"#"+item)?.join(',')
  let duration = bsmap["metadata"]["duration"]
  let diffs:[string,number][] = bsmap["versions"][0].diffs.map(it=>[it["difficulty"],it["notes"]/it["seconds"]])
  return (
    <>
      <p>
        <img src={bsmap["versions"][0]["coverURL"]}/>
        <br/>
        {bsmap["id"]} - {bsmap["name"]}
        <br/>
        {description}
        <br/>
        标签：{tagstr}
        <br/>
        时长：{duration}s
        <br/>
        {diffs.map(diff => <>
          难度：{diff[0]}，NPS:{diff[1].toFixed(2)}
          <br/>
        </>)}
      </p>
      <author>
        {uploader["name"]}
      </author>
    </>
  )
}
