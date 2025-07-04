import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import crypto from 'crypto'
import {z} from "zod/v4";

export interface S3Config {
  s3AccessKey: string
  s3SecretKey: string
  endpoint: string
  region?: string
  bucketName: string
  keyPrefix?: string
  baseURL: string
}



export const strictS3ConfigSchema = z.object({
  s3AccessKey: z.string(),
  s3SecretKey: z.string(),
  endpoint: z.string(),
  baseURL: z.string(),
  bucketName: z.string(),
  region: z.string().optional(),
  keyPrefix: z.string().optional(),
})

export const s3ConfigSchema = z.discriminatedUnion('enabled', [
  z.object({ enabled: z.literal(true), ...strictS3ConfigSchema.shape }),
  z.object({ enabled: z.literal(false),}),
])

export class S3Service {
  private s3Client: S3Client
  private readonly bucket: string
  private readonly keyPrefix: string = ''
  private readonly baseURL: string = ''
  constructor(config: S3Config) {
    const s3 = new S3Client({
      region: config.region ?? 'auto',
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.s3AccessKey,
        secretAccessKey: config.s3SecretKey,
      },
    })
    this.bucket = config.bucketName
    this.keyPrefix = config.keyPrefix
    this.baseURL = config.baseURL
    this.s3Client = s3
  }
  async uploadImgWithUrl(url: string, mimeType?: string): Promise<string> {
    const res = await fetch(url).then((it) => it.arrayBuffer())
    const buf = Buffer.from(res)
    // @ts-ignore
    const md5 = crypto.createHash('md5').update(buf).digest('hex')
    const key = this.keyPrefix ? `${this.keyPrefix}-${md5}` : md5
    const params = {
      Bucket: this.bucket,
      Key: key,
      Body: buf,
      ContentType: mimeType ?? 'image/png',
    }
    const command = new PutObjectCommand(params)
    const data = await this.s3Client.send(command)
    return `${this.baseURL}${key}`
  }
  async uploadImg(buffer: Buffer, mimeType?: string): Promise<string> {
    // md5 digest
    // @ts-ignore
    const md5 = crypto.createHash('md5').update(buffer).digest('hex')
    const key = this.keyPrefix ? `${this.keyPrefix}-${md5}` : md5
    const params = {
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType ?? 'image/png',
    }
    const command = new PutObjectCommand(params)
    const data = await this.s3Client.send(command)
    return `${this.baseURL}${key}`
  }
}
