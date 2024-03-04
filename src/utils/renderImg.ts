import {Context, h} from "koishi";

export const screenShot = async (ctx:Context,url: string,selector:string, onLoad?:()=>any,waitTime:number = 5000) => {
  console.log("start render")
  const page = await ctx.puppeteer.page()
  await page.setViewport({
    width: 960,
    height: 680 ,
    deviceScaleFactor: 2,
  })
  await page.goto(url);
  onLoad?.()
  await new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, waitTime)
  })
  const elm = await page.waitForSelector(selector, {timeout: 5000})
  console.log("start screenshot")
  const buffer = await elm.screenshot({})
  // = await page.screenshot({})
  await page.close()
  return buffer
  // const image = h.image(buffer, 'image/png')
  // return image
}
