import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { FiLock, FiUser } from 'react-icons/fi'
import { ToastContainer, toast } from 'react-toastify'

import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProfilePage from '../pages/ProfilePage'

// An empty value keeps requests on the frontend origin, where Vite proxies
// them during development. A deployed frontend can set this to its API origin.
const api = import.meta.env.VITE_API_URL || ''

/**
 * Shared application shell and authentication-session coordinator.
 *
 * Loads the current server-side session once, provides that user state to the
 * pages, and owns the common navigation, footer, and toast notifications.
 */
export default function Layout() {
  /** The authenticated profile returned by the backend, or null if signed out. */
  const [user, setUser] = useState(null)
  /** Keeps the profile route from briefly showing the signed-out state on load. */
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  /**
   * Hydrate the UI from the backend session when the app mounts.
   *
   * The request includes the HttpOnly session cookie. Aborting on unmount avoids
   * applying stale results if the application tree is replaced while it runs.
   */
  useEffect(() => {
    const controller = new AbortController()
    fetch(`${api}/api/session`, { credentials: 'include', signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Session request failed')
        return response.json()
      })
      .then((data) => setUser(data.user))
      .catch((error) => { if (error.name !== 'AbortError') toast.error('Unable to connect to the server.') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])

  /** Destroy the server session, then return to the public home page. */
  async function logout() {
    try {
      const response = await fetch(`${api}/api/logout`, { method: 'POST', credentials: 'include' })
      if (!response.ok) throw new Error('Logout failed')
      setUser(null)
      navigate('/')
      toast.success('You’ve signed out.')
    } catch {
      toast.error('Unable to sign out. Please try again.')
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand"><span className="brand-mark"><FiLock /></span> login<span>own</span><span className="brand-dot">.</span></Link>
        {/* NavLink supplies the active-page styling used by the shared header. */}
        <nav aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
        <Link className="nav-action" to={user ? '/profile' : '/login'}><FiUser /> <span>{user ? 'My account' : 'Sign in'}</span></Link>
      </header>
      {/* Keep one toast host mounted so any page or action can report feedback. */}
      <ToastContainer position="bottom-right" autoClose={3500} />
      {/* User and session-loading state are shared rather than fetched per page. */}
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/login" element={<LoginPage user={user} />} />
        <Route path="/profile" element={<ProfilePage user={user} loading={loading} onLogout={logout} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <footer><span>loginown</span><span>Made for a smoother sign-in experience <span className="footer-spark">✳</span></span></footer>
    </div>
  )
}