import React from 'react'

import { Link } from 'react-router-dom'
import { FiArrowRight, FiLock, FiLogOut, FiUser } from 'react-icons/fi'
import { toast } from 'react-toastify'

/**
 * Shows the authenticated account details and provides the sign-out action.
 * @param {{ user: { name: string, email: string | null, provider: string } | null, loading: boolean, onLogout: () => void }} props
 *   Session state and logout handler supplied by the shared Layout.
 */
export default class ProfilePage extends React.Component {
    /** @type {ReturnType<typeof setTimeout> | null} */
    timer = null

    /** Display a success notice after the OAuth callback returns to this page. */
    componentDidMount() {
        this.timer = setTimeout(() => {
            const url = new URL(window.location.href)
            if (url.searchParams.get('login') === 'success') {
                    // This callback marker is only needed for the notification;
                    // preserve the route and any unrelated query parameters.
                url.searchParams.delete('login')
                window.history.replaceState({}, '', url.pathname + url.search + url.hash)
                toast.success('You’re signed in!')
            }
        }, 0)
    }

    /** Avoid retaining a pending callback-notification timer after navigation. */
    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    /** Render loading, signed-out, and authenticated profile states. */
    render() {
        const { user, loading, onLogout } = this.props

        // Wait for the session request before deciding whether to show sign-in.
        if (loading) return <main className="centered-page"><p>Loading your profile…</p></main>
        // Keep the profile route navigable while offering a sign-in path to guests.
        if (!user) return <main className="centered-page"><div className="auth-card"><div className="card-icon"><FiLock /></div><h1>Your profile awaits.</h1><p>Sign in to see your account details here.</p><Link className="button button-primary" to="/login">Sign in <FiArrowRight /></Link></div></main>

        return (
            <main className="centered-page">
            <div className="auth-card profile-card">
                <div className="card-icon"><FiUser /></div>
                <span className="eyebrow">YOUR ACCOUNT</span>
                <h1>Hello, {user.name}.</h1>
                <p>It's good to have you here.</p>
                <div className="profile-details">
                <div><span>Name</span><strong>{user.name}</strong></div>
                <div><span>Email</span><strong>{user.email || 'Not shared by provider'}</strong></div>
                <div><span>Connected with</span><strong>{user.provider}</strong></div>
                </div>
                <button className="button button-outline" onClick={onLogout}><FiLogOut /> Sign out</button>
            </div>
            </main>
        )
    }
}
