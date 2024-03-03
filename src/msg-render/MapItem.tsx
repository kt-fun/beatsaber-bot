import {BSMap} from "../types";

export function BSMapItem({
item
}:{item:BSMap}) {
  const uploader = item["uploader"]["name"]
  const curator = item["curator"]
  let description = item["description"]
  if(description.length >= 37) {
    description = description.slice(0,37)+"..."
  }
  let tags = item["tags"]
  let tagstr = tags?.map(item=>"#"+item)?.join(',')
  let duration = item["metadata"]["duration"]
  let diffs:[string,number][] = item["versions"][0].diffs.map(it=>[it["difficulty"],it["notes"]/it["seconds"]])
  return (
    <>
      <p>
        <img src={item["versions"][0]["coverURL"]}/>
        <br/>
        {item["id"]} - {item["name"]}
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
        <br/>
        试听：{item["versions"][0].previewURL}
        <br/>

      </p>
      <author>
        {uploader["name"]}
      </author>
    </>
  )
}
