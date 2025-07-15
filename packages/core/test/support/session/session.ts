import {I18nService, User, Channel, S3Service, SessionAgent} from "@/index";
import path from "node:path";
import fs from "node:fs/promises";

export type Options = {
  i18n?: I18nService
  s3?: S3Service
  channel: Channel
  lang: string
}

export class TestSession {
    channel: Channel
    lang: string
    agent: SessionAgent;
    i18n?: I18nService
    s3?: S3Service
    public output: string[] = []

    constructor(
      private filepath: string,
      opts: Options
    ) {
      this.channel = opts.channel
      this.lang = opts.lang
      this.s3 = opts.s3
      this.i18n = opts.i18n
    }

    async sendImgByUrl(url: string): Promise<void> {
      this.output.push(`img-url:${url}`)
    }
    async sendAudioByUrl(url: string): Promise<void> {
      this.output.push(`audio-url:${url}`)
    }

    async sendImgBuffer(content: Buffer, mimeType?: string): Promise<void> {
      if (this.s3) {
        const url = await this.s3.uploadImg(content, mimeType)
        return await this.sendImgByUrl(url)
      }
      const hash = await hashBuf(content)
      const p = path.join( this.filepath,`${hash}.webp`)
      await writeFileAndCreateDir(p, content)
      this.output.push(`img-file:${p}`)
    }
    async send(msg: string): Promise<void> {
      this.output.push(msg)
    }
    async sendQueued(msg: string): Promise<void> {
      return this.send(msg)
    }
    async sendQuote(msg: string): Promise<void> {
      return this.send(msg)
    }

  text(path: string, params: object = {}): string {
    try {
      return this.i18n?.tran(path, params, this.lang) ?? path
    }catch (e) {
      console.log("i18n tran error", e)
      return path
    }
  }

  prompt(timeout?: number): Promise<string | undefined> {
      throw new Error("Method not implemented.");
  }

}



const hashBuf = async (buf: Buffer) => {
  const hash = await crypto.subtle.digest('SHA-256', buf)
  const hashArray = Array.from(new Uint8Array(hash))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

const regex = /src="(https?:[^"]+)"/
const tryToTransform = (t: string | undefined) => {
  if (!t) return undefined
  if (typeof t == 'string' && regex.test(t)) {
    const [, src] = regex.exec(t)
    const res = src?.replaceAll('&amp;', '&')
    return res
  }
  return t
}

async function writeFileAndCreateDir(filePath, content) {
  const directory = path.dirname(filePath);

  try {
    await fs.mkdir(directory, {recursive: true});
    await fs.writeFile(filePath, content);
  } catch (error) {
    console.error("写入失败", error);
  }
}
