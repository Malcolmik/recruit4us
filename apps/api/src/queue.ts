import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { env } from './env.js';
import { sendText } from './whatsapp.js';
import { twilioSendText } from './twilio.js';

const useTwilio = !!(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_WHATSAPP_FROM);
const url = env.REDIS_URL || '';
const enableRedis = /^rediss?:\/\//.test(url) && !/dummy/i.test(url);

const connection = enableRedis
  ? new IORedis(url, { maxRetriesPerRequest: null, enableReadyCheck: false })
  : undefined;

export const remindersQueue: any = enableRedis
  ? new Queue('reminders', { connection })
  : { add: async () => console.log('[remindersQueue] skipped (no Redis configured)') };

export function startReminderWorker() {
  if (!enableRedis) {
    console.log('[remindersWorker] skipped (no Redis configured)');
    return;
  }
  new Worker(
    'reminders',
    async (job) => {
      const { to, message } = job.data as { to: string; message: string };
      if (useTwilio) await twilioSendText(to, message);
      else await sendText(to, message);
    },
    { connection }
  );
}
