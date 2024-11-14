// import { createCanvas as _createCanvas } from 'canvas'
// import {Canvas} from "skia-canvas";
// export const createCanvas = (widht: number, height: number) => {
//   // createCanvas
//   // return new Canvas(widht, height);
//   return _createCanvas(widht, height)
// }
//
// export const canvasToDataURL = (canvas: any) => {
//   //node canvas      canvasRes.toDataURL('image/png');
//   // return  canvas.toDataURLSync('png')
//   return canvas.toDataURL('image/png')
// }


export const canvasHelper = {
  createCanvas: (h,w)=>{return ""},
  enable: false,
  canvasToDataURL: (canvas)=> ""
}

const canvasBuilder = async ()=> {
  try {

    const { createCanvas: _createCanvas } = await import('@napi-rs/canvas')
    canvasHelper.createCanvas = _createCanvas
    canvasHelper.canvasToDataURL = (canvas)=> {
      return canvas.encode('png')
    }
    canvasHelper.enable = true

  }catch(err) {
    try {
      const {createCanvas: _createCanvas} = await import('canvas')
      canvasHelper.createCanvas = _createCanvas
      canvasHelper.canvasToDataURL = (canvas)=> {
        return canvas.toDataURL('image/png')
      }
      canvasHelper.enable = true

    }catch(err) {
      const {Canvas} = await import('skia-canvas')
      canvasHelper.createCanvas = (h,w)=> {
        return new Canvas(h,w)
      }
      canvasHelper.canvasToDataURL = (canvas)=> {
        return canvas.toDataURLSync('image/png')
      }
      canvasHelper.enable = true
    }
  }
}

canvasBuilder().then(()=>console.log(`canvas init over: enable: ${canvasHelper.enable}`))
