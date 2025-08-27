import twilio from 'twilio'
import { env } from './env.js'
export async function twilioSendText(to: string, body: string) {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_WHATSAPP_FROM) {
    throw new Error('Twilio not configured')
  }
  const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN)
  return client.messages.create({
    from: env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to}`,
    body,
  })
}
