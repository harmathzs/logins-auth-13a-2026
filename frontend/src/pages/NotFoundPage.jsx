import React from "react";
import { FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

/** Fallback page for any URL that does not match a declared application route. */
export default class NotFoundPage extends React.Component {
    /** Render a recovery link that returns the user to the home route. */
    render() {
        return <main className="centered-page"><div className="auth-card"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>Looks like you're lost.</h1><p>We couldn't find the page you're looking for.</p><Link className="button button-primary" to="/">Back to home <FiArrowRight /></Link></div></main>
    }
}