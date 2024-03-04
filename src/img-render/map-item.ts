
import { createSSRApp } from 'vue'
import { renderToString  as rts} from 'vue/server-renderer'
import {BSMap} from "../types";
import {Context} from "koishi";

export const render = async (bsmap:BSMap,ctx:Context) => {
  const html = await renderHtml(bsmap)
  return await ctx.puppeteer.render(html)
}



export const renderHtml = async (bsmap:BSMap) => {
  console.log("rendering")
  const app = createSSRApp({
      components: {

      },
      data: () => ({
        bsMap: bsmap
      }),
      template: `
        <div class="flex items-center justify-center w-full h-full">
          <div :id="bsMap.id" class="border rounded-md  w-[300px] shadow-md bg-slate-100">
            <img :src="bsMap.versions[0].coverURL"
                 class="rounded  w-[300px]"
            />
            <div class="p-4">
              <div class="text-ellipsis  line-clamp-1">
                <span class="text-ellipsis  line-clamp-1 text-xl font-weight bg-gradient-to-r bg-clip-text text-transparent from-red-500 to-blue-500">
                {{bsMap.name}}
                </span>
              </div>

              <div class="author flex space-x-4 items-center ">

                <img :src="bsMap.uploader.avatar" class="rounded-full w-8 h-8"/>
                <span class="text-xl">{{bsMap.uploader.name}}</span>

              </div>
              <div class="meta  flex space-x-4 text-xs py-2 items-center">
                <div class="flex space-x-1 items-center justify-between">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"><path fill="currentColor" d="m12 1.75l-3.43.92l-4.5 16.83c-.01 0-.07.34-.07.5c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2c0-.16-.06-.5-.07-.5l-4.5-16.83zM10.29 4h3.42l3.49 13H13v-5h-2v5H6.8zM11 5v4h-1v2h4V9h-1V5z"/></svg>
                  <span>{{bsMap.metadata.bpm}}</span>
                </div>
                <div class="flex space-x-1 items-center justify-between">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 256 256"><path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m64-88a8 8 0 0 1-8 8h-56a8 8 0 0 1-8-8V72a8 8 0 0 1 16 0v48h48a8 8 0 0 1 8 8"/></svg>
                  <span>{{bsMap.metadata.duration}}s</span>
                </div>

                <div class="flex space-x-1 items-center justify-between">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 1024 1024"><path fill="currentColor" d="M608 112c-167.9 0-304 136.1-304 304c0 70.3 23.9 135 63.9 186.5l-41.1 41.1l-62.3-62.3a8.15 8.15 0 0 0-11.4 0l-39.8 39.8a8.15 8.15 0 0 0 0 11.4l62.3 62.3l-44.9 44.9l-62.3-62.3a8.15 8.15 0 0 0-11.4 0l-39.8 39.8a8.15 8.15 0 0 0 0 11.4l62.3 62.3l-65.3 65.3a8.03 8.03 0 0 0 0 11.3l42.3 42.3c3.1 3.1 8.2 3.1 11.3 0l253.6-253.6A304.06 304.06 0 0 0 608 720c167.9 0 304-136.1 304-304S775.9 112 608 112m161.2 465.2C726.2 620.3 668.9 644 608 644c-60.9 0-118.2-23.7-161.2-66.8c-43.1-43-66.8-100.3-66.8-161.2c0-60.9 23.7-118.2 66.8-161.2c43-43.1 100.3-66.8 161.2-66.8c60.9 0 118.2 23.7 161.2 66.8c43.1 43 66.8 100.3 66.8 161.2c0 60.9-23.7 118.2-66.8 161.2"/></svg>
                  <span
                    class="font-weight bg-gradient-to-r bg-clip-text text-transparent from-red-500 to-blue-500">
  {{bsMap.id}}
  </span>
                </div>

              </div>

              <div class="tags flex space-x-4 *:text-sm *:text-white *:bg-red-500 *:rounded-md *:p-0.5">
  <span v-for="item in bsMap.tags">
    {{ item }}
  </span>
              </div>
              <div class="percentage">
                <progress class="progress w-56 " :value="bsMap.stats.score * 100" max="100"></progress>
              </div>
              <span class="font-bold">难度</span>
              <div class="grid grid-cols-2">
                <div v-for="diff in bsMap.versions[0].diffs" class="text-xs flex space-x-2">
                  <span>{{diff.difficulty}}</span>
                  <span>{{(diff.nps).toFixed(2)}}</span>
                </div>
              </div>

              <span class="font-bold">描述</span>
              <p class="text-xs">
                {{bsMap.description}}
              </p>
            </div>
          </div>

        </div>
  `
    }
  )
  let res =""
  try {
    res = await rts(app)
  }catch (e) {
    console.log("errr",e)
  }

  return ` <!DOCTYPE html>
    <html>
    <head>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@4.7.2/dist/full.min.css" rel="stylesheet" type="text/css" />
      <script src="https://cdn.tailwindcss.com"></script>
      <title>IMG Render</title>
    </head>
    <body>
    ${res}
    </body>
    </html>
    `
}
