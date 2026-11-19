import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaGoogle, FaSalesforce } from 'react-icons/fa'
import { FiArrowRight, FiCheck, FiLock, FiShield, FiUser } from 'react-icons/fi'

/**
 * Public landing page with a sign-in call to action and provider overview.
 * @param {{ user: { name: string } | null }} props Current authenticated profile.
 */
export default class HomePage extends React.Component {
  /** Render the public page, adapting its primary action to session state. */
    render() {
        const { user } = this.props

        return (
            <main className="hero">
              <div className="hero-copy">
                <span className="eyebrow"><span className="status-dot" /> A SIMPLER WAY TO SIGN IN</span>
                <h1>One less password.<br /><span>More possibilities.</span></h1>
                <p>Welcome to a simpler, more secure way to connect. Sign in with an account you already know and get right to what matters.</p>
                <div className="hero-actions">
                  {/* Signed-in users go straight to their profile; others start login. */}
                  <Link className="button button-primary" to={user ? '/profile' : '/login'}>
                    {user ? 'View your profile' : 'Get started'} <FiArrowRight />
                  </Link>
                  <span className="action-note"><FiLock /> No password needed</span>
                </div>
                <div className="trusted">
                  <span>CONNECT WITH</span>
                  <div><FaGoogle /> Google</div>
                  <div><FaFacebookF /> Facebook</div>
                  <div><FaSalesforce /> Salesforce</div>
                </div>
              </div>
              <div className="hero-art" aria-hidden="true">
                <div className="art-glow" />
                <div className="art-card">
                  <div className="art-icon"><FiUser /></div>
                  <div className="art-line wide" /><div className="art-line short" />
                  <div className="art-divider" />
                  <div className="art-row"><span><FiShield /></span><div><strong>Secure by design</strong><small>Your account, protected</small></div><FiCheck /></div>
                  <div className="art-row"><span><FiLock /></span><div><strong>Easy access</strong><small>Just a few clicks away</small></div><FiCheck /></div>
                </div>
                <div className="floating-badge"><FiCheck /> You're all set</div>
              </div>
            </main>
          )
    }
}