import db from './db.js';

// Award points to a user and re-evaluate milestone progress.
export function awardPoints(userId, amount) {
  db.prepare('UPDATE users SET points = points + ? WHERE id = ?').run(amount, userId);
  return checkMilestones(userId);
}

// Update a daily study streak. Returns the new streak value.
export function bumpStreak(userId) {
  const user = db.prepare('SELECT last_study_date, streak FROM users WHERE id = ?').get(userId);
  const today = new Date().toISOString().slice(0, 10);
  if (user.last_study_date === today) return user.streak;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newStreak = user.last_study_date === yesterday ? user.streak + 1 : 1;
  db.prepare('UPDATE users SET streak = ?, last_study_date = ? WHERE id = ?').run(
    newStreak,
    today,
    userId
  );
  return newStreak;
}

// Compute the metric values used to evaluate milestones.
function metricValue(userId, metric) {
  switch (metric) {
    case 'points':
      return db.prepare('SELECT points AS v FROM users WHERE id = ?').get(userId)?.v ?? 0;
    case 'streak':
      return db.prepare('SELECT streak AS v FROM users WHERE id = ?').get(userId)?.v ?? 0;
    case 'cards_studied':
      return (
        db
          .prepare('SELECT COALESCE(SUM(cards_studied),0) AS v FROM study_sessions WHERE user_id = ?')
          .get(userId)?.v ?? 0
      );
    case 'sessions':
      return (
        db.prepare('SELECT COUNT(*) AS v FROM study_sessions WHERE user_id = ?').get(userId)?.v ?? 0
      );
    case 'questions':
      return db.prepare('SELECT COUNT(*) AS v FROM questions WHERE user_id = ?').get(userId)?.v ?? 0;
    case 'answers':
      return db.prepare('SELECT COUNT(*) AS v FROM answers WHERE user_id = ?').get(userId)?.v ?? 0;
    default:
      return 0;
  }
}

// Award any newly-earned milestones. Returns the list of newly unlocked ones.
export function checkMilestones(userId) {
  const all = db.prepare('SELECT * FROM milestones').all();
  const owned = new Set(
    db
      .prepare('SELECT milestone_id FROM user_milestones WHERE user_id = ?')
      .all(userId)
      .map((r) => r.milestone_id)
  );
  const newly = [];
  const insert = db.prepare(
    'INSERT OR IGNORE INTO user_milestones (user_id, milestone_id) VALUES (?, ?)'
  );
  for (const m of all) {
    if (owned.has(m.id)) continue;
    if (metricValue(userId, m.metric) >= m.threshold) {
      insert.run(userId, m.id);
      newly.push(m);
    }
  }
  return newly;
}
