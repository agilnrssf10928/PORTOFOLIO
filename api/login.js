const crypto = require('crypto');
const { createSession, setSessionCookie } = require('./_auth');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  if (!process.env.ADMIN_PASSWORD_HASH || !process.env.SESSION_SECRET) {
    return response.status(500).json({ error: 'Auth belum dikonfigurasi di Vercel.' });
  }

  const { password } = typeof request.body === 'string' ? JSON.parse(request.body) : (request.body || {});
  const supplied = hashPassword(String(password || ''));
  const expected = process.env.ADMIN_PASSWORD_HASH;
  const valid = supplied.length === expected.length && crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));

  if (!valid) return response.status(401).json({ error: 'Password salah.' });
  setSessionCookie(response, createSession());
  return response.status(200).json({ ok: true });
};
