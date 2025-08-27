export default function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="card"><h2 className="font-semibold">Jobs</h2><p>Manage open roles and pipelines.</p></div>
      <div className="card"><h2 className="font-semibold">Candidates</h2><p>View, upload CVs and track stages.</p></div>
      <div className="card"><h2 className="font-semibold">WhatsApp</h2><p>Send booking links & reminders.</p></div>
    </div>
  )
}
