import { Router } from 'express';
import db from '../db.js';

const router = Router();

// List chat rooms.
router.get('/rooms', (req, res) => {
  res.json({ rooms: db.prepare('SELECT * FROM rooms ORDER BY id').all() });
});

// Recent messages for a room.
router.get('/rooms/:id/messages', (req, res) => {
  const messages = db
    .prepare(
      `SELECT m.*, u.username, u.avatar
       FROM messages m JOIN users u ON u.id = m.user_id
       WHERE m.room_id = ? ORDER BY m.created_at DESC LIMIT 100`
    )
    .all(req.params.id)
    .reverse();
  res.json({ messages });
});

export default router;
