import { Router } from 'express';
import db from '../db.js';
import { authRequired } from '../auth.js';
import { awardPoints, checkMilestones } from '../points.js';

const router = Router();

// List questions with author + answer counts.
router.get('/', (req, res) => {
  const { q, tag } = req.query;
  let sql = `SELECT q.*, u.username AS author, u.avatar AS author_avatar,
                    (SELECT COUNT(*) FROM answers a WHERE a.question_id = q.id) AS answer_count,
                    (SELECT COUNT(*) FROM answers a WHERE a.question_id = q.id AND a.is_accepted = 1) AS solved
             FROM questions q JOIN users u ON u.id = q.user_id`;
  const where = [];
  const params = [];
  if (q) {
    where.push('(q.title LIKE ? OR q.body LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }
  if (tag) {
    where.push('q.tags LIKE ?');
    params.push(`%${tag}%`);
  }
  if (where.length) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY q.created_at DESC LIMIT 100';
  res.json({ questions: db.prepare(sql).all(...params) });
});

// One question with its answers.
router.get('/:id', (req, res) => {
  const question = db
    .prepare(
      `SELECT q.*, u.username AS author, u.avatar AS author_avatar
       FROM questions q JOIN users u ON u.id = q.user_id WHERE q.id = ?`
    )
    .get(req.params.id);
  if (!question) return res.status(404).json({ error: 'Question not found' });
  const answers = db
    .prepare(
      `SELECT a.*, u.username AS author, u.avatar AS author_avatar
       FROM answers a JOIN users u ON u.id = a.user_id
       WHERE a.question_id = ? ORDER BY a.is_accepted DESC, a.votes DESC, a.created_at ASC`
    )
    .all(req.params.id);
  res.json({ question, answers });
});

// Post a question (+10 points).
router.post('/', authRequired, (req, res) => {
  const { title, body, tags } = req.body || {};
  if (!title || !body) return res.status(400).json({ error: 'Title and body are required' });
  const info = db
    .prepare('INSERT INTO questions (user_id, title, body, tags) VALUES (?, ?, ?, ?)')
    .run(req.user.id, title, body, (tags || '').trim());
  awardPoints(req.user.id, 10);
  checkMilestones(req.user.id);
  res.json({ question: db.prepare('SELECT * FROM questions WHERE id = ?').get(info.lastInsertRowid) });
});

// Post an answer (+15 points).
router.post('/:id/answers', authRequired, (req, res) => {
  const { body } = req.body || {};
  if (!body) return res.status(400).json({ error: 'Answer body is required' });
  const question = db.prepare('SELECT id FROM questions WHERE id = ?').get(req.params.id);
  if (!question) return res.status(404).json({ error: 'Question not found' });
  const info = db
    .prepare('INSERT INTO answers (question_id, user_id, body) VALUES (?, ?, ?)')
    .run(req.params.id, req.user.id, body);
  awardPoints(req.user.id, 15);
  checkMilestones(req.user.id);
  res.json({ answer: db.prepare('SELECT * FROM answers WHERE id = ?').get(info.lastInsertRowid) });
});

// Vote on a question or answer.
router.post('/vote', authRequired, (req, res) => {
  const { type, id, dir } = req.body || {};
  const delta = dir === 'down' ? -1 : 1;
  if (type === 'question') {
    db.prepare('UPDATE questions SET votes = votes + ? WHERE id = ?').run(delta, id);
  } else if (type === 'answer') {
    db.prepare('UPDATE answers SET votes = votes + ? WHERE id = ?').run(delta, id);
  } else {
    return res.status(400).json({ error: 'Invalid vote target' });
  }
  res.json({ ok: true });
});

// Accept an answer (only the question's author).
router.post('/:qid/accept/:aid', authRequired, (req, res) => {
  const question = db.prepare('SELECT user_id FROM questions WHERE id = ?').get(req.params.qid);
  if (!question) return res.status(404).json({ error: 'Question not found' });
  if (question.user_id !== req.user.id)
    return res.status(403).json({ error: 'Only the asker can accept an answer' });
  db.prepare('UPDATE answers SET is_accepted = 0 WHERE question_id = ?').run(req.params.qid);
  db.prepare('UPDATE answers SET is_accepted = 1 WHERE id = ? AND question_id = ?').run(
    req.params.aid,
    req.params.qid
  );
  const answer = db.prepare('SELECT user_id FROM answers WHERE id = ?').get(req.params.aid);
  if (answer) {
    awardPoints(answer.user_id, 25); // bonus for accepted answer
    checkMilestones(answer.user_id);
  }
  res.json({ ok: true });
});

export default router;
