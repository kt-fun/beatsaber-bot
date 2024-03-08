import {Component} from "@vue/runtime-core";
import {createSSRApp} from "vue";
import {renderToString as rts} from "@vue/server-renderer";

export * from './bsmap'



export const renderHTML = async (rootComponent:Component) => {
  const app = createSSRApp(rootComponent)
  let res =""
  try {
    res = await rts(app)
  }catch (e) {
    console.log("render error",e)
    res = `
    <div class="flex min-h-screen w-full items-center justify-center">
     Ops, some error occur during render img
    </div>
    `
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
