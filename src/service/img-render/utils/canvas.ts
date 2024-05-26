import { createCanvas as _createCanvas} from "canvas";
// import {Canvas} from "skia-canvas";
export const createCanvas = (widht: number, height: number)=> {
  // createCanvas
  // return new Canvas(widht, height);
  return _createCanvas(widht,height)
}

export const canvasToDataURL = (canvas: any) => {
  //node canvas      canvasRes.toDataURL('image/png');
  // return  canvas.toDataURLSync('png')
  return  canvas.toDataURL('image/png')
}
