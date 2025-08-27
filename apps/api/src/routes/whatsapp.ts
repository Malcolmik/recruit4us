import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { sendText } from '../whatsapp.js'
import { db } from '../db.js'
import { bookingLinks, candidates } from '../schema.js'
import crypto from 'crypto'
import { eq } from 'drizzle-orm'
import { remindersQueue } from '../queue.js'
import { twilioSendText } from '../twilio.js'
import { env } from '../env.js'

const r = Router()

r.post('/send-text', requireAuth, requireRole('admin','recruiter'), async (req, res) => {
  const { to, message } = req.body
  const usingTwilio = !!(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_WHATSAPP_FROM)
  const result = usingTwilio ? await twilioSendText(to, message) : await sendText(to, message)
  res.json({ ok: true, provider: usingTwilio ? 'twilio' : 'meta', result })
})
r.post('/booking/create', requireAuth, requireRole('admin','recruiter'), async (req,res)=>{
  const { candidateId, jobId } = req.body
  const token = crypto.randomBytes(16).toString('hex')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  await db.insert(bookingLinks).values({ token, candidateId, jobId, expiresAt })
  res.json({ token, url: `${req.headers.origin || 'http://localhost:5173'}/booking/${token}` })
})
r.get('/booking/:token', async (req,res)=>{
  const token = req.params.token
  const base = new Date()
  const slots = [1,2,3].map(d => new Date(base.getTime() + d*24*60*60*1000 + 10*60*60*1000).toISOString())
  res.json({ token, slots })
})
r.post('/booking/:token/confirm', async (req, res) => {
  try {
    const token = req.params.token;
    const { slot } = req.body as { slot: string };
    if (!slot) return res.status(400).json({ message: 'Missing slot' });

    // Save booking
    const [row] = await db.update(bookingLinks)
      .set({ scheduledAt: new Date(slot), used: true })
      .where(eq(bookingLinks.token, token))
      .returning();

    if (!row) return res.status(404).json({ message: 'Invalid token' });

    // Lookup candidate phone
    const candRow = await db.select().from(candidates).where(eq(candidates.id, row.candidateId!));
    const to = candRow[0]?.phone;

    // Schedule reminder WITHOUT blocking the response
    if (to) {
      const remindAt = new Date(new Date(slot).getTime() - 60 * 60 * 1000); // 1h before
      const delay = Math.max(0, remindAt.getTime() - Date.now());

      // fire-and-forget (never await)
      remindersQueue
        .add('whatsapp-reminder', {
          to,
          message: `Reminder: your interview is at ${new Date(slot).toLocaleString()}`
        }, { delay })
        .catch((err: any) => console.error('[queue add failed]', err));
    }

    // Respond immediately
    return res.json({ ok: true });
  } catch (e: any) {
    console.error('[confirm error]', e);
    return res.status(500).json({ message: 'Could not confirm booking' });
  }
});
export default r
