import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { db } from '../db.js'
import { candidates } from '../schema.js'
import { eq } from 'drizzle-orm'
const r = Router()
r.use(requireAuth)
r.get('/', async (_req,res)=>{ const all = await db.select().from(candidates).orderBy(candidates.id); res.json(all) })
r.post('/', requireRole('admin','recruiter'), async (req,res)=>{ const { fullName,email,phone }=req.body; const [row]=await db.insert(candidates).values({ fullName,email,phone }).returning(); res.json(row) })
r.post('/:id/cv', requireRole('admin','recruiter'), async (req,res)=>{ const id=Number(req.params.id); const { url }=req.body; const [row]=await db.update(candidates).set({ cvUrl:url }).where(eq(candidates.id,id)).returning(); res.json(row) })
export default r
