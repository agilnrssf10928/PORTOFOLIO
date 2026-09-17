const crypto = require('crypto');

function base64Url(value) {
  return Buffer.from(value).toString('base64url');
}

function parseCookies(request) {
  return Object.fromEntries((request.headers.cookie || '').split(';').filter(Boolean).map(pair => {
    const index = pair.indexOf('=');
    return [pair.slice(0, index).trim(), decodeURIComponent(pair.slice(index + 1).trim())];
  }));
}

function sign(value) {
  return crypto.createHmac('sha256', process.env.SESSION_SECRET).update(value).digest('base64url');
}

function createSession() {
  const payload = base64Url(JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000 }));
  return `${payload}.${sign(payload)}`;
}

function isAuthenticated(request) {
  const token = parseCookies(request).portfolio_session;
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !process.env.SESSION_SECRET) return false;
  const expected = sign(payload);
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now();
  } catch {
    return false;
  }
}

function setSessionCookie(response, session) {
  response.setHeader('Set-Cookie', `portfolio_session=${encodeURIComponent(session)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`);
}

module.exports = { createSession, isAuthenticated, setSessionCookie };
