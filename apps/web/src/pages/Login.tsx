import { useState } from 'react'
import { API } from '../lib'
import { useNavigate } from 'react-router-dom'
export default function Login() {
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState<string|null>(null)
  const navigate=useNavigate()
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault()
    try{
      const {data}=await API.post('/auth/login',{email,password})
      localStorage.setItem('token',data.token); navigate('/')
    }catch(err:any){ setError(err?.response?.data?.message||'Login failed') }
  }
  return (
    <div className="min-h-screen grid place-items-center p-4 bg-brandBg">
      <form onSubmit={submit} className="card w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-brandPrimary">Welcome back</h1>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <input className="w-full border rounded p-2 mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full border rounded p-2 mb-3" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn w-full btn-accent">Login</button>
      </form>
    </div>
  )
}
