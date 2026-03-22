import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PANEL_PASSWORD || process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ error: 'Admin password not configured on server' });
  }

  if (password === adminPassword) {
    // Set a simple cookie for "session"
    // In a real app, this should be a JWT or similar, but for a "simple password gate" as requested:
    const cookie = serialize('admin_session', adminPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: 'Nieprawidłowe hasło' });
}
