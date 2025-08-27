import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { db } from '../db.js'
import { jobs } from '../schema.js'
import { eq } from 'drizzle-orm'
const r = Router()
r.use(requireAuth)
r.get('/', async (_req,res)=>{ const all = await db.select().from(jobs).orderBy(jobs.id); res.json(all) })
r.post('/', requireRole('admin','recruiter'), async (req,res)=>{ const { title,department,description }=req.body; const [row]=await db.insert(jobs).values({ title,department,description }).returning(); res.json(row) })
r.put('/:id', requireRole('admin','recruiter'), async (req,res)=>{ const id=Number(req.params.id); const { title,department,description }=req.body; const [row]=await db.update(jobs).set({ title,department,description }).where(eq(jobs.id,id)).returning(); res.json(row) })
r.delete('/:id', requireRole('admin'), async (req,res)=>{ const id=Number(req.params.id); await db.delete(jobs).where(eq(jobs.id,id)); res.json({ ok:true }) })
export default r
