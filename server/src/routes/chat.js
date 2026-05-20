import { Router } from 'express';
import { get, all, run } from '../db.js';
import { authRequired } from '../auth.js';
import { awardPoints } from '../points.js';

const router = Router();

// List chat rooms.
router.get('/rooms', async (req, res) => {
  res.json({ rooms: await all('SELECT * FROM rooms ORDER BY id') });
});

// Recent messages for a room (oldest first). Supports ?after=<id> for polling.
router.get('/rooms/:id/messages', async (req, res) => {
  const after = Number(req.query.after) || 0;
  const messages = (
    await all(
      `SELECT m.*, u.username, u.avatar
       FROM messages m JOIN users u ON u.id = m.user_id
       WHERE m.room_id = ? AND m.id > ?
       ORDER BY m.id DESC LIMIT 100`,
      [req.params.id, after]
    )
  ).reverse();
  res.json({ messages });
});

// Send a message to a room (+1 point for participation).
router.post('/rooms/:id/messages', authRequired, async (req, res) => {
  const content = (req.body?.content || '').trim();
  if (!content) return res.status(400).json({ error: 'Message cannot be empty' });
  const room = await get('SELECT id FROM rooms WHERE id = ?', [req.params.id]);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  const info = await run('INSERT INTO messages (room_id, user_id, content) VALUES (?, ?, ?)', [
    req.params.id,
    req.user.id,
    content.slice(0, 2000),
  ]);
  await awardPoints(req.user.id, 1);
  const message = await get(
    `SELECT m.*, u.username, u.avatar FROM messages m
     JOIN users u ON u.id = m.user_id WHERE m.id = ?`,
    [info.lastInsertRowid]
  );
  res.json({ message });
});

export default router;
