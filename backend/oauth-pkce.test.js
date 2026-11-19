const test = require('node:test')
const assert = require('node:assert/strict')
const { createCodeVerifier, createCodeChallenge } = require('./oauth-pkce')

test('creates a URL-safe code verifier of a valid length', () => {
  const verifier = createCodeVerifier()

  assert.match(verifier, /^[A-Za-z0-9_-]{43}$/)
})

test('creates the S256 challenge from the RFC 7636 example verifier', () => {
  const verifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'

  assert.equal(createCodeChallenge(verifier), 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM')
})