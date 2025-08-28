import { Queue, Worker, type ConnectionOptions } from 'bullmq';
import { env } from './env.js';
import { sendText } from './whatsapp.js';
import { twilioSendText } from './twilio.js';

const useTwilio =
  !!(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_WHATSAPP_FROM);

const enableRedis = /^rediss?:\/\//i.test(env.REDIS_URL || '') && !/dummy/i.test(env.REDIS_URL || '');

// Build a concrete options object (BullMQ v5 wants ConnectionOptions, never undefined)
const connectionOpts: ConnectionOptions = {
  url: (env.REDIS_URL || 'redis://unused'),
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

export const remindersQueue: any = enableRedis
  ? new Queue('reminders', { connection: connectionOpts })
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
    { connection: connectionOpts }
  );
}
