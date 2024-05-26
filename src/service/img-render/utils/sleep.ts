export const sleep = async (millsec: number = 5000)=> {
  await new Promise<void>((resolve, reject)=> {
    setTimeout(resolve,millsec)
  })
}
