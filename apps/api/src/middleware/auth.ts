import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../env.js'
export type JwtUser = { id:number; role:'admin'|'recruiter'|'viewer'; email:string }
export function requireAuth(req:Request,res:Response,next:NextFunction){
  const header = req.headers.authorization || ''
  const token = header.replace('Bearer ','')
  if (!token) return res.status(401).json({ message:'Missing token' })
  try { const decoded = jwt.verify(token, env.JWT_SECRET) as JwtUser; (req as any).user = decoded; next() }
  catch { return res.status(401).json({ message:'Invalid token' }) }
}
export function requireRole(...roles:JwtUser['role'][]){
  return (req:Request,res:Response,next:NextFunction)=>{
    const user = (req as any).user as JwtUser | undefined
    if (!user) return res.status(401).json({ message:'Unauthorized' })
    if (!roles.includes(user.role)) return res.status(403).json({ message:'Forbidden' })
    next()
  }
}
