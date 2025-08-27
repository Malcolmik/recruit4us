import { useEffect, useState } from 'react'
import { API } from '../lib'
type Job = { id:number; title:string; department?:string|null; description?:string|null; createdAt:string }
export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [title,setTitle]=useState(''); const [department,setDepartment]=useState(''); const [description,setDescription]=useState('')
  const load = async () => { const { data } = await API.get('/jobs'); setJobs(data) }
  useEffect(()=>{ load() },[])
  const create = async (e:React.FormEvent) => { e.preventDefault(); await API.post('/jobs',{ title,department,description }); setTitle('');setDepartment('');setDescription(''); load() }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="card">
        <h2 className="font-semibold mb-2">Create Job</h2>
        <form onSubmit={create} className="grid gap-2">
          <input className="border rounded p-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className="border rounded p-2" placeholder="Department" value={department} onChange={e=>setDepartment(e.target.value)} />
          <textarea className="border rounded p-2" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
          <button className="btn btn-accent">Save</button>
        </form>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">Jobs</h2>
        <ul className="space-y-2">
          {jobs.map(j => (
            <li key={j.id} className="border rounded p-2 flex items-center justify-between">
              <div>
                <div className="font-semibold">{j.title}</div>
                <div className="text-sm text-slate-500">{j.department}</div>
              </div>
              <span className="text-xs text-slate-500">{new Date(j.createdAt).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
