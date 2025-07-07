import {z} from 'zod/v4'
import {renderSchema} from "@/common/render";
import {s3ConfigSchema} from "@/common/s3";

const cronSchema = z.object({
  enabled: z.boolean().optional().default(false),
  cron: z.string().optional(),
}).optional().default({ enabled: false })

export const configSchema = z.object({
  s3: s3ConfigSchema.default({ enabled: false }).optional(),
  render: renderSchema,
  beatsaver: z.object({
    host: z.string().default('https://api.beatsaver.com').optional(),
    wsURL: z.string().default('wss://ws.beatsaver.com/maps').optional(),
    oauthClientId: z.string().optional(),
    oauthClientSecret: z.string().optional(),
  }).default({
    host: 'https://api.beatsaver.com',
    wsURL: 'wss://ws.beatsaver.com/maps',
  }).optional(),
  beatleader: z.object({
    oauthClientId: z.string().optional(),
    oauthClientSecret: z.string().optional(),
  }).default({}).optional(),
  cron: z.object({
    temp: cronSchema,
  }).default({
    temp: {enabled: false},
  }).optional()
})

export type Config = z.infer<typeof configSchema>
