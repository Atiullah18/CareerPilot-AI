
import { useState } from 'react'
import './App.css'

const initialJobs = [
  { id: 1, role: 'Frontend Developer', company: 'Google', location: 'Bangalore', status: 'Interview', type: 'Full-time' },
  { id: 2, role: 'React Developer', company: 'Microsoft', location: 'Hyderabad', status: 'Applied', type: 'Full-time' },
  { id: 3, role: 'UI Developer', company: 'Infosys', location: 'Bangalore', status: 'Applied', type: 'Internship' },
  { id: 4, role: 'Software Engineer', company: 'Amazon', location: 'Chennai', status: 'Offer', type: 'Full-time' },
  { id: 5, role: 'Web Developer', company: 'Wipro', location: 'Pune', status: 'Rejected', type: 'Internship' },
]

function App() {
  const [jobs, setJobs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('applysmart-jobs')) || initialJobs
    } catch {
      return initialJobs
    }
  })

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [dark, setDark] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('Bangalore')
  const [description, setDescription] = useState('')
  const [resume, setResume] = useState('React JavaScript HTML CSS')
  const [match, setMatch] = useState(null)
  const [page, setPage] = useState('Dashboard')

  const saveJobs = (updated) => {
    setJobs(updated)
    localStorage.setItem('applysmart-jobs', JSON.stringify(updated))
  }

  const changeStatus = (id, status) => {
    saveJobs(jobs.map(job =>
      job.id === id ? { ...job, status } : job
    ))
  }

  const addJob = (e) => {
    e.preventDefault()
    if (!role.trim() || !company.trim()) return

    saveJobs([
      {
        id: Date.now(),
        role,
        company,
        location,
        status: 'Applied',
        type: 'Full-time'
      },
      ...jobs
    ])

    setRole('')
    setCompany('')
    setLocation('Bangalore')
    setShowForm(false)
    setPage('Applications')
  }

  const filtered = jobs.filter(job =>
    `${job.role} ${job.company} ${job.location}`
      .toLowerCase()
      .includes(search.toLowerCase()) &&
    (filter === 'All' || job.status === filter)
  )

  const count = (status) =>
    jobs.filter(job => job.status === status).length

  const matchScore = () => {
    const words = description.toLowerCase().match(/[a-z+#.]+/g) || []
    const resumeWords = new Set(
      resume.toLowerCase().match(/[a-z+#.]+/g) || []
    )
    const keywords = [...new Set(words.filter(w => w.length > 2))]
    const score = keywords.length
      ? Math.round(
          keywords.filter(w => resumeWords.has(w)).length /
          keywords.length * 100
        )
      : 0

    setMatch(score)
  }

  const nav = [
    ['▦', 'Dashboard'],
    ['⌕', 'Find Jobs'],
    ['▤', 'Applications'],
    ['✦', 'Resume Matcher']
  ]

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">C</span>
          CareerPilot AI<span className="brand-dot">.</span>
        </div>

        <p className="nav-label">WORKSPACE</p>

        {nav.map(([icon, label]) => (
          <button
            key={label}
            className={`nav-item ${page === label ? 'active' : ''}`}
            onClick={() => {
              setPage(label)
              setFilter('All')
              setShowForm(false)
            }}
          >
            <span>{icon}</span>{label}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="help-card">
            <span>✦ Your next opportunity</span>
            <p>Small steps today. Big career tomorrow.</p>
          </div>

          <div className="user">
            <div className="avatar">MA</div>
            <div>
              <strong>My Workspace</strong>
              <small>Job seeker</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace / <strong>{page}</strong>
          </div>

          <div className="top-actions">
            <button
              className="theme-btn"
              onClick={() => setDark(!dark)}
            >
              {dark ? '☀️ Light mode' : '🌙 Dark mode'}
            </button>
            <div className="avatar">MA</div>
          </div>
        </header>

        <div className="content">
          <div className="welcome">
            <div>
              <span className="eyebrow">YOUR CAREER, ORGANIZED</span>
              <h1>
                {page === 'Dashboard'
                  ? 'Good things are ahead.'
                  : page}
              </h1>
              <p>
                Track your journey. Stay focused. Land your next opportunity.
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={() => {
                setShowForm(!showForm)
                setPage('Applications')
              }}
            >
              ＋ Add application
            </button>
          </div>

          {showForm && (
            <form className="form-card" onSubmit={addJob}>
              <h3>Add a job application</h3>

              <div className="form-grid">
                <input
                  placeholder="Job title *"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  required
                />
                <input
                  placeholder="Company name *"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  required
                />
                <input
                  placeholder="Location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>

              <button className="primary-btn" type="submit">
                Save application
              </button>
              <button
                className="cancel-btn"
                type="button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </form>
          )}

          {(page === 'Dashboard' || page === 'Applications') && (
            <>
              <section className="stats">
                {[
                  ['Total applications', jobs.length, '↗', 'stat-purple'],
                  ['Interviews', count('Interview'), '◉', 'stat-blue'],
                  ['Offers received', count('Offer'), '✦', 'stat-green'],
                  ['Awaiting response', count('Applied'), '◷', 'stat-orange']
                ].map(([label, value, icon, color]) => (
                  <div className="stat-card" key={label}>
                    <div className={`stat-icon ${color}`}>{icon}</div>
                    <span>{label}</span>
                    <strong>{value}</strong>
                    <small>Based on your tracked jobs</small>
                  </div>
                ))}
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Application tracker</h2>
                    <p>Manage and update your job applications</p>
                  </div>
                  <button
                    className="text-btn"
                    onClick={() => {
                      setPage('Applications')
                      setShowForm(false)
                    }}
                  >
                    View all ↗
                  </button>
                </div>

                <div className="filters">
                  <input
                    className="search"
                    placeholder="⌕ Search role, company or location..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                  >
                    <option>All</option>
                    {['Applied', 'Interview', 'Offer', 'Rejected'].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>ROLE / COMPANY</th>
                        <th>LOCATION</th>
                        <th>STATUS</th>
                        <th>UPDATE STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(job => (
                        <tr key={job.id}>
                          <td>
                            <div className="job-cell">
                              <div className="company-icon">
                                {job.company[0]}
                              </div>
                              <div>
                                <strong>{job.role}</strong>
                                <small>{job.company} · {job.type}</small>
                              </div>
                            </div>
                          </td>
                          <td>{job.location}</td>
                          <td>
                            <span className={`status status-${job.status.toLowerCase()}`}>
                              {job.status}
                            </span>
                          </td>
                          <td>
                            <select
                              className="status-select"
                              value={job.status}
                              onChange={e =>
                                changeStatus(job.id, e.target.value)
                              }
                            >
                              {['Applied', 'Interview', 'Offer', 'Rejected'].map(s => (
                                <option key={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filtered.length === 0 && (
                    <p className="empty">
                      No applications found. Try another search.
                    </p>
                  )}
                </div>
              </section>
            </>
          )}

          {page === 'Find Jobs' && (
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Explore opportunities</h2>
                  <p>Explore sample jobs and track interesting roles.</p>
                </div>
              </div>

              <input
                className="search full-search"
                placeholder="⌕ Search jobs, companies, locations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              <div className="job-grid">
                {initialJobs
                  .filter(j =>
                    `${j.role} ${j.company} ${j.location}`
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                  .map(job => (
                    <article className="job-card" key={job.id}>
                      <div className="company-icon large">
                        {job.company[0]}
                      </div>
                      <span className="job-type">{job.type}</span>
                      <h3>{job.role}</h3>
                      <p>{job.company} · {job.location}</p>
                      <button
                        className="primary-btn"
                        onClick={() => {
                          if (!jobs.some(j =>
                            j.role === job.role &&
                            j.company === job.company
                          )) {
                            saveJobs([
                              { ...job, id: Date.now(), status: 'Applied' },
                              ...jobs
                            ])
                          }
                          setPage('Applications')
                        }}
                      >
                        ＋ Track application
                      </button>
                    </article>
                  ))}
              </div>
            </section>
          )}

          {page === 'Resume Matcher' && (
            <section className="panel matcher">
              <div className="panel-heading">
                <div>
                  <h2>✦ Resume keyword matcher</h2>
                  <p>Compare your skills against a job description.</p>
                </div>
              </div>

              <label>Your skills / resume keywords</label>
              <textarea
                value={resume}
                onChange={e => setResume(e.target.value)}
                placeholder="React, JavaScript, HTML, CSS..."
              />

              <label>Paste job description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Paste the job requirements here..."
              />

              <button className="primary-btn" onClick={matchScore}>
                Calculate keyword match
              </button>

              {match !== null && (
                <div className="match-result">
                  <strong>{match}%</strong>
                  <p>
                    Keyword overlap score — a simple estimate, not an AI assessment.
                  </p>
                  <div className="progress">
                    <span style={{ width: `${match}%` }} />
                  </div>
                </div>
              )}
            </section>
          )}

          <footer>
            © 2026 CareerPilot AI
            <span>Built with React · Made for your next step ✦</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
