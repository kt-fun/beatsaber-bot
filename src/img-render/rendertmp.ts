import Puppeteer from "koishi-plugin-puppeteer";

export const screenshotTmp = async (puppeteer:Puppeteer, url: string, selector:string, onLoad?:()=>any, waitTime:number = 5000) => {
  const page = await puppeteer.page()
  await page.setViewport({
    width: 1400,
    height: 4096,
    deviceScaleFactor: 2,
  })
  await page.goto(url,{timeout: 0, waitUntil:'domcontentloaded'});
  onLoad?.()
  await new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, waitTime)
  })
  const elm = await page.waitForSelector(selector, {timeout: waitTime})
  const buffer = await elm.screenshot({})
  // = await page.screenshot({})
  await page.close()
  return buffer
}
