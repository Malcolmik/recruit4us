import { Router } from 'express'
import { db } from '../db.js'
import { users } from '../schema.js'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { env } from '../env.js'
import { hashPassword, verifyPassword } from '../utils/crypto.js'
const r = Router()
r.post('/seed-admin', async (req,res)=>{
  const { email, password } = req.body
  const existing = await db.select().from(users).where(eq(users.email, email))
  if (existing.length) return res.status(400).json({ message:'exists' })
  const passwordHash = await hashPassword(password)
  await db.insert(users).values({ email, passwordHash, role:'admin' })
  res.json({ ok:true })
})
r.post('/login', async (req,res)=>{
  const { email, password } = req.body
  const rows = await db.select().from(users).where(eq(users.email, email))
  const user = rows[0]
  if (!user) return res.status(400).json({ message:'Invalid credentials' })
  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) return res.status(400).json({ message:'Invalid credentials' })
  const token = jwt.sign({ id:user.id, role:user.role, email:user.email }, env.JWT_SECRET, { expiresIn:'7d' })
  res.json({ token })
})
export default r
