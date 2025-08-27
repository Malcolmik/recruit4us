import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { env } from './env.js'
import authRoutes from './routes/auth.js'
import jobsRoutes from './routes/jobs.js'
import candidatesRoutes from './routes/candidates.js'
import uploadRoutes from './routes/upload.js'
import whatsappRoutes from './routes/whatsapp.js'
import { startReminderWorker } from './queue.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(morgan('tiny'))

app.get('/api/health', (_req,res)=>res.json({ ok:true }))

app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobsRoutes)
app.use('/api/candidates', candidatesRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/whatsapp', whatsappRoutes)

startReminderWorker()

app.listen(Number(env.PORT), ()=>{ console.log(`API listening on :${env.PORT}`) })
