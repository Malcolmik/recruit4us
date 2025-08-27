import { Pool } from 'pg'
import { env } from './env.js'
import { drizzle } from 'drizzle-orm/node-postgres'
export const pool = new Pool({ connectionString: env.DATABASE_URL })
export const db = drizzle(pool)
