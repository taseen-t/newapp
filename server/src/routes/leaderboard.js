import { Router } from 'express';
import { all } from '../db.js';

const router = Router();

// Top users overall, plus weekly study points.
router.get('/', async (req, res) => {
  const allTime = await all(
    `SELECT id, username, avatar, points, streak,
            (SELECT COUNT(*)::int FROM user_milestones um WHERE um.user_id = users.id) AS milestones
     FROM users ORDER BY points DESC, username ASC LIMIT 50`
  );

  const weekly = await all(
    `SELECT u.id, u.username, u.avatar,
            COALESCE(SUM(ss.points_earned), 0)::int AS week_points
     FROM users u
     LEFT JOIN study_sessions ss
       ON ss.user_id = u.id AND ss.created_at >= now() - interval '7 days'
     GROUP BY u.id
     HAVING COALESCE(SUM(ss.points_earned), 0) > 0
     ORDER BY week_points DESC LIMIT 20`
  );

  res.json({ allTime, weekly });
});

export default router;
