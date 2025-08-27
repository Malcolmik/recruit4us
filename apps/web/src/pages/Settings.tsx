import { useState } from 'react'
import { API } from '../lib'
export default function Settings() {
  const [to,setTo]=useState('')
  const [message,setMessage]=useState('Hello from Recruit4Us 👋')
  const send = async()=>{ await API.post('/whatsapp/send-text',{ to,message }); alert('Sent (if approved)') }
  return (
    <div className="card max-w-xl">
      <h2 className="font-semibold mb-2">WhatsApp test</h2>
      <input className="border rounded p-2 w-full mb-2" placeholder="+234..." value={to} onChange={e=>setTo(e.target.value)} />
      <textarea className="border rounded p-2 w-full mb-2" value={message} onChange={e=>setMessage(e.target.value)} />
      <button className="btn btn-accent" onClick={send}>Send Test</button>
    </div>
  )
}
