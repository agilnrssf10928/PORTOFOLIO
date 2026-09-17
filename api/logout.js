module.exports = function handler(request, response) {
  response.setHeader('Set-Cookie', 'portfolio_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
  return response.status(200).json({ ok: true });
};
