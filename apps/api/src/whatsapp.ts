import { env } from './env.js'
import fetch from 'node-fetch'
const BASE='https://graph.facebook.com/v20.0'
export async function sendText(to:string, body:string){
  const url=`${BASE}/${env.WHATSAPP_PHONE_ID}/messages`
  const res=await fetch(url,{ method:'POST', headers:{ 'Authorization':`Bearer ${env.WHATSAPP_TOKEN}`,'Content-Type':'application/json' }, body: JSON.stringify({ messaging_product:'whatsapp', to, type:'text', text:{ body } }) })
  if(!res.ok){ const t=await res.text(); throw new Error(`WhatsApp API error: ${res.status} ${t}`) }
  return res.json()
}
export async function sendTemplate(to:string, template:string, lang='en_US', components?:any[]){
  const url=`${BASE}/${env.WHATSAPP_PHONE_ID}/messages`
  const res=await fetch(url,{ method:'POST', headers:{ 'Authorization':`Bearer ${env.WHATSAPP_TOKEN}`,'Content-Type':'application/json' }, body: JSON.stringify({ messaging_product:'whatsapp', to, type:'template', template:{ name:template, language:{ code:lang }, components } }) })
  if(!res.ok){ const t=await res.text(); throw new Error(`WhatsApp API error: ${res.status} ${t}`) }
  return res.json()
}
