import { useEffect, useState } from 'react'
import { API } from '../lib'
type Candidate = { id:number; fullName:string; email:string; phone?:string|null; cvUrl?:string|null; createdAt:string }
export default function Candidates() {
  const [list, setList] = useState<Candidate[]>([])
  const [fullName,setFullName]=useState(''); const [email,setEmail]=useState(''); const [phone,setPhone]=useState('')
  const load = async () => { const { data } = await API.get('/candidates'); setList(data) }
  useEffect(()=>{ load() },[])
  const create = async (e:React.FormEvent) => { e.preventDefault(); await API.post('/candidates',{ fullName,email,phone }); setFullName('');setEmail('');setPhone(''); load() }
  const upload = async (e: React.ChangeEvent<HTMLInputElement>, candidateId: number) => {
    const file = e.target.files?.[0]; if (!file) return;
    const { data } = await API.post('/upload/presign', { filename: file.name, contentType: file.type })
    await fetch(data.url, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })
    await API.post(`/candidates/${candidateId}/cv`, { url: data.publicUrl }); load()
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="card">
        <h2 className="font-semibold mb-2">Create Candidate</h2>
        <form onSubmit={create} className="grid gap-2">
          <input className="border rounded p-2" placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} />
          <input className="border rounded p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="border rounded p-2" placeholder="Phone (WhatsApp)" value={phone} onChange={e=>setPhone(e.target.value)} />
          <button className="btn btn-accent">Save</button>
        </form>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">Candidates</h2>
        <ul className="space-y-2">
          {list.map(c => (
            <li key={c.id} className="border rounded p-2">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{c.fullName}</div>
                  <div className="text-sm text-slate-500">{c.email} {c.phone ? `• ${c.phone}` : ''}</div>
                </div>
                <span className="text-xs text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <label className="text-sm">Upload CV: <input type="file" onChange={(e)=>upload(e, c.id)} /></label>
                
                {c.cvUrl && (
                  <button
                    className="text-brandPrimary underline"
                    onClick={async () => {
                      try {
                        const { data } = await API.post('/upload/sign-get', { url: c.cvUrl });
                        window.open(data.url, '_blank', 'noopener');
                      } catch {
                        alert('Could not fetch secure view URL');
                      }
                    }}
                  >
                    View CV (secure)
                  </button>
                )}



              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
