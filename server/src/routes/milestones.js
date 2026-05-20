import { Router } from 'express';
import { get, all } from '../db.js';
import { verifyToken } from '../auth.js';

const router = Router();

async function metric(userId, m) {
  switch (m) {
    case 'points':
      return (await get('SELECT points AS v FROM users WHERE id = ?', [userId])).v;
    case 'streak':
      return (await get('SELECT streak AS v FROM users WHERE id = ?', [userId])).v;
    case 'cards_studied':
      return (await get('SELECT COALESCE(SUM(cards_studied),0) AS v FROM study_sessions WHERE user_id = ?', [userId])).v;
    case 'sessions':
      return (await get('SELECT COUNT(*) AS v FROM study_sessions WHERE user_id = ?', [userId])).v;
    case 'questions':
      return (await get('SELECT COUNT(*) AS v FROM questions WHERE user_id = ?', [userId])).v;
    case 'answers':
      return (await get('SELECT COUNT(*) AS v FROM answers WHERE user_id = ?', [userId])).v;
    default:
      return 0;
  }
}

// List all milestones; if authenticated, mark which are achieved + progress.
router.get('/', async (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const payload = token && verifyToken(token);

  const milestones = await all('SELECT * FROM milestones ORDER BY threshold ASC');

  if (!payload) {
    return res.json({ milestones: milestones.map((m) => ({ ...m, achieved: false, progress: 0 })) });
  }

  const ownedRows = await all(
    'SELECT milestone_id, achieved_at FROM user_milestones WHERE user_id = ?',
    [payload.id]
  );
  const owned = new Map(ownedRows.map((r) => [r.milestone_id, r.achieved_at]));

  const result = [];
  for (const m of milestones) {
    const current = await metric(payload.id, m.metric);
    result.push({
      ...m,
      achieved: owned.has(m.id),
      achieved_at: owned.get(m.id) || null,
      current: Math.min(current, m.threshold),
      progress: Math.min(100, Math.round((current / m.threshold) * 100)),
    });
  }

  res.json({ milestones: result });
});

export default router;
