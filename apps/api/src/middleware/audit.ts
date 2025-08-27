import { Request, Response, NextFunction } from 'express'
import { db } from '../db.js'
import { auditLogs } from '../schema.js'
export function audit(action:string, entity?:string, entityId?:number){
  return async (req:Request,_res:Response,next:NextFunction)=>{
    const user=(req as any).user; const ip=req.headers['x-forwarded-for']||req.socket.remoteAddress||''
    try{ await db.insert(auditLogs).values({ userId:user?.id, action, entity, entityId, ip: Array.isArray(ip)?ip[0]:String(ip) }) }catch{}
    next()
  }
}
