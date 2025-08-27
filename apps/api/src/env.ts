import 'dotenv/config'
import { z } from 'zod'
const envSchema = z.object({
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  S3_BUCKET: z.string(),
  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  REDIS_URL: z.string(),
  WHATSAPP_TOKEN: z.string(),
  WHATSAPP_PHONE_ID: z.string(),
  OPENAI_API_KEY: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_WHATSAPP_FROM: z.string().optional(),

})
export const env = envSchema.parse(process.env)
