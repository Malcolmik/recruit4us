import { Outlet, Link, useNavigate } from 'react-router-dom'
import './index.css'
export default function App() {
  const navigate = useNavigate()
  const logout = () => { localStorage.removeItem('token'); navigate('/login') }
  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-brandPrimary">Recruit<span className="text-brandAccent">4</span>Us</Link>
          <div className="flex gap-4">
            <Link to="/jobs" className="hover:underline">Jobs</Link>
            <Link to="/candidates" className="hover:underline">Candidates</Link>
            <Link to="/settings" className="hover:underline">Settings</Link>
            <button onClick={logout} className="btn btn-accent">Logout</button>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-4"><Outlet /></main>
    </div>
  )
}
