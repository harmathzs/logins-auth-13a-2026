# loginown

A small social sign-in example with an Express API and a Vite/React frontend. Users can sign in with Google, Facebook, or Salesforce; there is no email/password form or local password database.

## Features

- Provider-hosted OAuth authorization with Google, Facebook, and Salesforce.
- Server-side authorization-code exchange; provider access tokens are not sent to the browser or stored in the application session.
- Salesforce PKCE using the S256 challenge method.
- An HttpOnly session cookie, profile page, logout action, and friendly handling for unconfigured providers.
- React Router navigation, React Toastify notifications, React Icons, and plain CSS styling.

## Requirements

- Node.js 18, 20, or 22+, and npm. Node.js 18 is end-of-life; use a supported Node.js release for production.
- An OAuth application and client credentials for each provider you want to enable. Unconfigured providers remain visible but show a notification when selected.

## Run locally

Use the same hostname (`localhost`, not a mixture of `localhost` and `127.0.0.1`) for both applications so the session cookie is shared.

1. Configure the API:

   ```sh
   cd backend
   npm install
   cp .env.example .env
   ```

   In PowerShell, use `Copy-Item .env.example .env` in place of `cp` if needed.

   Set `SESSION_SECRET` to a long, random value (for example, generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`). Fill in the client ID and secret for each provider you want to use. Never commit `.env` or provider secrets.

2. Start the API:

   ```sh
   npm run dev
   ```

3. In a second terminal, start the frontend:

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

4. Open <http://localhost:5173>. Vite proxies `/api` and `/auth` to the API at `http://localhost:3001`. If you change the API port, update the proxy in `frontend/vite.config.js` as well as `PORT` and `BACKEND_URL`.

## Usage

- `/` shows the home page and links to sign-in or the profile, depending on the current session.
- `/login` starts sign-in with one of the configured identity providers. Provider credentials are entered only on that provider's site.
- `/profile` shows the name, email when shared, and provider returned by the identity provider. Visitors who are signed out see a sign-in link.
- The header's **Sign out** action destroys the server session and returns to the home page.
- Unknown paths show a not-found page.

The frontend loads the current session from `GET /api/session`. OAuth starts at `GET /auth/:provider`; after the provider approves access, the backend validates the OAuth state, exchanges the authorization code, fetches the provider profile, and redirects to `/profile`. Salesforce authorization uses PKCE. `POST /api/logout` destroys the session and requires the configured frontend origin.

## Provider setup

Create a web/server-side OAuth application in each provider's developer console. Register the **exact** callback URL shown below, including the scheme and port. Copy its client ID and secret to the corresponding variables in `backend/.env`; restart the API after changing them.

| Provider | Callback URL for local development | Environment variables | Requested scopes |
| --- | --- | --- | --- |
| Google | `http://localhost:3001/auth/google/callback` | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | `openid profile email` |
| Facebook | `http://localhost:3001/auth/facebook/callback` | `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET` | `public_profile,email` |
| Salesforce | `http://localhost:3001/auth/salesforce/callback` | `SALESFORCE_CLIENT_ID`, `SALESFORCE_CLIENT_SECRET` | `openid profile email` |

- **Google:** Configure the OAuth consent screen and create a Web application client in [Google Cloud Console](https://console.cloud.google.com/). Add the callback to its authorized redirect URIs. If the consent screen is in testing mode, add your account as a test user. See [Google's web-server OAuth guide](https://developers.google.com/identity/protocols/oauth2/web-server).
- **Facebook:** Create an app with Facebook Login in [Meta for Developers](https://developers.facebook.com/). Add the callback to Valid OAuth Redirect URIs, and use an eligible app role/test user while the app is in development mode. Permissions and live access may require Meta review. See [Facebook Login for the web](https://developers.facebook.com/docs/facebook-login/web/).
- **Salesforce:** Create a connected app with the authorization-code flow enabled, set its callback URL, and enable the OpenID Connect, profile, and email scopes. The backend uses PKCE with S256 for Salesforce sign-in. Set `SALESFORCE_LOGIN_URL=https://test.salesforce.com` for a sandbox; the default is `https://login.salesforce.com`. Connected-app policies and approval can affect access. See [Salesforce OAuth documentation](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_web_server_flow.htm&type=5).

Provider consoles and approval requirements can change. If a provider does not share an email address, the profile displays “Not shared by provider.”

## Application structure

- `backend/server.js` configures Express, CORS, the session cookie, and provider endpoints. It validates OAuth state, exchanges authorization codes server-side, fetches provider profiles, regenerates the session after login, and redirects to the frontend.
- `backend/oauth-pkce.js` creates Salesforce PKCE verifiers and S256 challenges. The verifier stays in the server-side session and is sent only to Salesforce's token endpoint.
- `backend/.env.example` lists backend configuration keys. Copy it to `backend/.env` for local development; never commit populated credentials.
- `frontend/src/App.jsx` mounts the router. `frontend/src/components/Layout.jsx` loads the session and provides shared navigation, routes, and toast notifications.
- `frontend/src/pages/` contains the home, login, profile, and not-found pages. React Router handles navigation, React Toastify displays feedback, and React Icons supplies the icons.
- `frontend/vite.config.js` configures the local `/api` and `/auth` development proxy.

## Configuration and deployment

`FRONTEND_URL` is the frontend origin, and `BACKEND_URL` is the externally accessible API origin used to construct OAuth callback URLs. Both default to the localhost URLs above and should have no trailing slash. `PORT` controls the API listener. For a separately hosted frontend, set `VITE_API_URL` to the backend origin **at frontend build time**; otherwise requests use the same origin. Configure your static host to fall back to `index.html` for client-side routes, and proxy `/api` and `/auth` to the API if using the same origin.

| Variable | Used by | Purpose | Local default |
| --- | --- | --- | --- |
| `PORT` | Backend | Port for the Express API. | `3001` |
| `FRONTEND_URL` | Backend | Allowed frontend origin and post-login redirect destination. | `http://localhost:5173` |
| `BACKEND_URL` | Backend | Public API origin used to build OAuth callback URLs. | `http://localhost:3001` |
| `SESSION_SECRET` | Backend | Secret used to sign the session cookie; replace the example with a long random value. | None; required |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Backend | Google OAuth application credentials. | Empty |
| `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET` | Backend | Meta app credentials for Facebook Login. | Empty |
| `SALESFORCE_CLIENT_ID`, `SALESFORCE_CLIENT_SECRET` | Backend | Salesforce OAuth application credentials. | Empty |
| `SALESFORCE_LOGIN_URL` | Backend | Salesforce login host; use the sandbox host when appropriate. | `https://login.salesforce.com` |
| `VITE_API_URL` | Frontend build | Backend origin when frontend and API are hosted separately. | Empty (same origin/proxy) |

This is a development example, **not a production-ready authentication service**. Express's default in-memory session store loses sessions on restart and is not suitable for production or multiple servers. Before deployment, use a persistent session store, HTTPS, a strong secret, and review provider configuration, rate limiting, session lifecycle, and security settings. With `NODE_ENV=production` the cookie is secure and requires HTTPS; set `TRUST_PROXY=1` only when the API is behind exactly one trusted reverse proxy. Cookies use `SameSite=Lax`, so frontend and backend must be on the same site. Configure CORS and origins deliberately; do not expose secrets through `VITE_` variables.

## Checks

Run the backend's built-in Node test suite from `backend`:

```sh
cd backend
npm test
```

Run the frontend lint and production build checks from `frontend`:

```sh
cd frontend
npm run lint
npm run build
```

For a manual smoke test, open the home and login pages, try an unconfigured provider, visit `/profile` while signed out, and visit an unknown route. To test a complete sign-in and sign-out, configure a provider and use an authorized account. Confirm that Salesforce's authorization request includes an S256 challenge and that login returns to the profile.

## Troubleshooting

- **Provider says it is not configured:** Confirm both credential variables for that provider are populated in `backend/.env`, then restart the backend.
- **Redirect URI mismatch:** The provider callback must exactly match `BACKEND_URL` plus `/auth/<provider>/callback`, including scheme, host, port, and path. Update the provider app settings if any part differs.
- **Salesforce rejects scopes:** Make sure the External Client App selected scopes cover `openid profile email` and that the app is enabled. The backend adds PKCE automatically.
- **Frontend cannot reach the API:** For local development, keep the frontend and backend on `localhost`, and ensure the Vite proxy and backend `PORT` agree. For separate hosting, set `VITE_API_URL` at build time and set the backend's `FRONTEND_URL` and `BACKEND_URL` to their public origins.

## References

- [Express](https://expressjs.com/) and [express-session](https://github.com/expressjs/session)
- [Vite](https://vite.dev/guide/), [React](https://react.dev/), and [React Router](https://reactrouter.com/)
- [React Icons](https://react-icons.github.io/react-icons/) and [React Toastify](https://fkhadra.github.io/react-toastify/introduction/)
- [OAuth 2.0 authorization code flow and state](https://www.rfc-editor.org/rfc/rfc6749#section-4.1)
