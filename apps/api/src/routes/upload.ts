import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { env } from '../env.js'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'
const r = Router()
r.use(requireAuth)
const s3 = new S3Client({ region: env.AWS_REGION, credentials: { accessKeyId: env.AWS_ACCESS_KEY_ID, secretAccessKey: env.AWS_SECRET_ACCESS_KEY }})
r.post('/presign', async (req,res)=>{
  const { filename, contentType } = req.body
  const key = `cv/${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${filename}`
  const cmd = new PutObjectCommand({ Bucket: env.S3_BUCKET, Key: key, ContentType: contentType })
  const url = await getSignedUrl(s3, cmd, { expiresIn: 60 * 5 })
  const publicUrl = `https://${env.S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`
  res.json({ url, publicUrl })
})
r.post('/sign-get', async (req, res) => {
  const { url } = req.body as { url: string }
  if (!url) return res.status(400).json({ message: 'Missing url' })

  try {
    const u = new URL(url)
    const key = decodeURIComponent(u.pathname.replace(/^\/+/, '')) // <- important
    const cmd = new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: key })
    const signed = await getSignedUrl(s3, cmd, { expiresIn: 60 }) // 60s
    return res.json({ url: signed })
  } catch (e: any) {
    return res.status(400).json({ message: 'Bad url', detail: String(e?.message || e) })
  }
})

export default r
