import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API } from '../lib'

export default function Booking() {
  const { token } = useParams()
  const [slots, setSlots] = useState<string[]>([])
  const [chosen, setChosen] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')     // <-- new
  const [busy, setBusy] = useState<boolean>(false)   // <-- new

  useEffect(() => {
    async function load() {
      try {
        setError('')
        const { data } = await API.get(`/whatsapp/booking/${token}`)
        setSlots(data.slots || [])
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Could not load slots')
      }
    }
    load()
  }, [token])


  const withTimeout = <T,>(p: Promise<T>, ms = 15000) =>
  new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Request timed out')), ms)
    p.then(v => { clearTimeout(t); resolve(v) })
     .catch(e => { clearTimeout(t); reject(e) })
  })


  const confirm = async () => {
    if (!chosen) return
    try {
      setBusy(true)
      setError('')
      setStatus('')
      await withTimeout(
        API.post(`/whatsapp/booking/${token}/confirm`, { slot: chosen }),
        15000)
      setStatus('Booked! We will send you a reminder on WhatsApp.')
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Could not confirm booking')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4 bg-brandBg">
      <div className="card w-full max-w-md">
        <h1 className="text-xl font-bold mb-3 text-brandPrimary">Pick a time</h1>

        {error && <p className="mb-2 text-red-600">{error}</p>}
        {status && <p className="mb-2 text-green-700">{status}</p>}

        <div className="space-y-2">
          {slots.length === 0 && !error && <p className="text-sm text-slate-500">No slots available yet.</p>}
          {slots.map(s => (
            <label key={s} className="flex items-center gap-2">
              <input type="radio" name="slot" value={s} onChange={()=>setChosen(s)} />
              <span>{new Date(s).toLocaleString()}</span>
            </label>
          ))}
        </div>

        <button
          className="btn btn-accent mt-3 disabled:opacity-50"
          disabled={!chosen || busy}
          onClick={confirm}
        >
          {busy ? 'Confirming...' : 'Confirm'}
        </button>
      </div>
    </div>
  )
}
