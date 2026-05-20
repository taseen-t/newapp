import { Router } from 'express';
import db from '../db.js';
import { authRequired, verifyToken } from '../auth.js';

const router = Router();

// List all milestones; if authenticated, mark which are achieved + progress.
router.get('/', (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const payload = token && verifyToken(token);

  const milestones = db.prepare('SELECT * FROM milestones ORDER BY threshold ASC').all();

  if (!payload) {
    return res.json({ milestones: milestones.map((m) => ({ ...m, achieved: false, progress: 0 })) });
  }

  const owned = new Map(
    db
      .prepare('SELECT milestone_id, achieved_at FROM user_milestones WHERE user_id = ?')
      .all(payload.id)
      .map((r) => [r.milestone_id, r.achieved_at])
  );

  const metric = (m) => {
    switch (m) {
      case 'points':
        return db.prepare('SELECT points AS v FROM users WHERE id = ?').get(payload.id).v;
      case 'streak':
        return db.prepare('SELECT streak AS v FROM users WHERE id = ?').get(payload.id).v;
      case 'cards_studied':
        return db
          .prepare('SELECT COALESCE(SUM(cards_studied),0) AS v FROM study_sessions WHERE user_id = ?')
          .get(payload.id).v;
      case 'sessions':
        return db.prepare('SELECT COUNT(*) AS v FROM study_sessions WHERE user_id = ?').get(payload.id).v;
      case 'questions':
        return db.prepare('SELECT COUNT(*) AS v FROM questions WHERE user_id = ?').get(payload.id).v;
      case 'answers':
        return db.prepare('SELECT COUNT(*) AS v FROM answers WHERE user_id = ?').get(payload.id).v;
      default:
        return 0;
    }
  };

  res.json({
    milestones: milestones.map((m) => {
      const current = metric(m.metric);
      return {
        ...m,
        achieved: owned.has(m.id),
        achieved_at: owned.get(m.id) || null,
        current: Math.min(current, m.threshold),
        progress: Math.min(100, Math.round((current / m.threshold) * 100)),
      };
    }),
  });
});

export default router;
