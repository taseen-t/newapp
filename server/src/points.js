import { get, all, run } from './db.js';

// Award points to a user and re-evaluate milestone progress.
export async function awardPoints(userId, amount) {
  await run('UPDATE users SET points = points + ? WHERE id = ?', [amount, userId]);
  return checkMilestones(userId);
}

// Update a daily study streak. Returns the new streak value.
export async function bumpStreak(userId) {
  const user = await get('SELECT last_study_date, streak FROM users WHERE id = ?', [userId]);
  const today = new Date().toISOString().slice(0, 10);
  if (user.last_study_date === today) return user.streak;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newStreak = user.last_study_date === yesterday ? user.streak + 1 : 1;
  await run('UPDATE users SET streak = ?, last_study_date = ? WHERE id = ?', [newStreak, today, userId]);
  return newStreak;
}

// Compute the metric values used to evaluate milestones.
async function metricValue(userId, metric) {
  switch (metric) {
    case 'points':
      return (await get('SELECT points AS v FROM users WHERE id = ?', [userId]))?.v ?? 0;
    case 'streak':
      return (await get('SELECT streak AS v FROM users WHERE id = ?', [userId]))?.v ?? 0;
    case 'cards_studied':
      return (
        (await get('SELECT COALESCE(SUM(cards_studied),0)::int AS v FROM study_sessions WHERE user_id = ?', [userId]))?.v ?? 0
      );
    case 'sessions':
      return (await get('SELECT COUNT(*)::int AS v FROM study_sessions WHERE user_id = ?', [userId]))?.v ?? 0;
    case 'questions':
      return (await get('SELECT COUNT(*)::int AS v FROM questions WHERE user_id = ?', [userId]))?.v ?? 0;
    case 'answers':
      return (await get('SELECT COUNT(*)::int AS v FROM answers WHERE user_id = ?', [userId]))?.v ?? 0;
    default:
      return 0;
  }
}

// Award any newly-earned milestones. Returns the list of newly unlocked ones.
export async function checkMilestones(userId) {
  const allMs = await all('SELECT * FROM milestones');
  const ownedRows = await all('SELECT milestone_id FROM user_milestones WHERE user_id = ?', [userId]);
  const owned = new Set(ownedRows.map((r) => r.milestone_id));
  const newly = [];
  for (const m of allMs) {
    if (owned.has(m.id)) continue;
    if ((await metricValue(userId, m.metric)) >= m.threshold) {
      await run(
        'INSERT INTO user_milestones (user_id, milestone_id) VALUES (?, ?) ON CONFLICT DO NOTHING',
        [userId, m.id]
      );
      newly.push(m);
    }
  }
  return newly;
}
