import { Router } from 'express';
import db from '../db.js';

const router = Router();

// Top users overall, plus weekly study points.
router.get('/', (req, res) => {
  const allTime = db
    .prepare(
      `SELECT id, username, avatar, points, streak,
              (SELECT COUNT(*) FROM user_milestones um WHERE um.user_id = users.id) AS milestones
       FROM users ORDER BY points DESC, username ASC LIMIT 50`
    )
    .all();

  const weekly = db
    .prepare(
      `SELECT u.id, u.username, u.avatar,
              COALESCE(SUM(ss.points_earned), 0) AS week_points
       FROM users u
       LEFT JOIN study_sessions ss
         ON ss.user_id = u.id AND ss.created_at >= datetime('now', '-7 days')
       GROUP BY u.id
       HAVING week_points > 0
       ORDER BY week_points DESC LIMIT 20`
    )
    .all();

  res.json({ allTime, weekly });
});

export default router;
