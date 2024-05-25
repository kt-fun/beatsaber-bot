
import {CornerDotType, CornerSquareType, DotType, QRCodeCanvas, TypeNumber} from '@loskir/styled-qr-code-node';

export default async function createQrcode(url: string,width: number = 300, height: number = 300) {
  const options ={
    width: width ?? 300,
    height: height ?? 300,
    type: 'canvas' as any,
    data: url,
    margin: 0,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: 'Byte' as any,
      errorCorrectionLevel: 'Q' as any
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.2,
      margin: 10,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      color: '#ffffff',
      type: 'rounded' as DotType
    },
    backgroundOptions: {
      color: 'rgb(0,0,0,0)',
    },
    cornersSquareOptions: {
      color: '#ffffff',
      type: 'extra-rounded' as CornerSquareType,
    },
    cornersDotOptions: {
      color: '#ffffff',
      type: 'dot' as CornerDotType,
    }
  }
  const qrCode = new QRCodeCanvas(options);

  const svg = await qrCode.toDataUrl('svg')
  return svg
}
