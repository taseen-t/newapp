import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { signToken, authRequired } from '../auth.js';

const router = Router();
const AVATAR_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

function publicUser(u) {
  if (!u) return null;
  const { password_hash, ...rest } = u;
  return rest;
}

router.post('/register', (req, res) => {
  const { username, email, password } = req.body || {};
  if (!username || !email || !password)
    return res.status(400).json({ error: 'username, email and password are required' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const exists = db
    .prepare('SELECT id FROM users WHERE username = ? OR email = ?')
    .get(username, email);
  if (exists) return res.status(409).json({ error: 'Username or email already taken' });

  const hash = bcrypt.hashSync(password, 10);
  const avatar = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
  const info = db
    .prepare('INSERT INTO users (username, email, password_hash, avatar) VALUES (?, ?, ?, ?)')
    .run(username, email, hash, avatar);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  res.json({ token: signToken(user), user: publicUser(user) });
});

router.post('/login', (req, res) => {
  const { emailOrUsername, password } = req.body || {};
  if (!emailOrUsername || !password)
    return res.status(400).json({ error: 'Credentials required' });
  const user = db
    .prepare('SELECT * FROM users WHERE email = ? OR username = ?')
    .get(emailOrUsername, emailOrUsername);
  if (!user || !bcrypt.compareSync(password, user.password_hash))
    return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: signToken(user), user: publicUser(user) });
});

router.get('/me', authRequired, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  res.json({ user: publicUser(user) });
});

router.put('/me', authRequired, (req, res) => {
  const { bio, avatar } = req.body || {};
  db.prepare('UPDATE users SET bio = COALESCE(?, bio), avatar = COALESCE(?, avatar) WHERE id = ?').run(
    bio ?? null,
    avatar ?? null,
    req.user.id
  );
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  res.json({ user: publicUser(user) });
});

export default router;
