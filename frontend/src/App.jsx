import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

import Layout from './components/Layout'

/**
 * Root component for the client-side application.
 *
 * The router lives here so the shared layout and every page can use React
 * Router links, navigation hooks, and route declarations within one context.
 */
export default class App extends React.Component {
  /** Mounts the router around the shared application layout. */
  render() {
    return (
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    )
  }
}
