const crypto = require('node:crypto')

function createCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url')
}

function createCodeChallenge(verifier) {
  return crypto.createHash('sha256').update(verifier).digest('base64url')
}

module.exports = { createCodeVerifier, createCodeChallenge }