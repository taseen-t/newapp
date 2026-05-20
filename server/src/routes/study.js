import { Router } from 'express';
import { get, all, run } from '../db.js';
import { authRequired } from '../auth.js';
import { awardPoints, bumpStreak, checkMilestones } from '../points.js';

const router = Router();

// All subjects with deck counts.
router.get('/subjects', async (req, res) => {
  const subjects = await all(
    `SELECT s.*, COUNT(DISTINCT d.id) AS deck_count
     FROM subjects s LEFT JOIN decks d ON d.subject_id = s.id
     GROUP BY s.id ORDER BY s.name`
  );
  res.json({ subjects });
});

// Decks, optionally filtered by subject.
router.get('/decks', async (req, res) => {
  const { subjectId } = req.query;
  const rows = await all(
    `SELECT d.*, s.name AS subject_name, s.color AS subject_color, u.username AS owner_name,
            COUNT(c.id) AS card_count
     FROM decks d
     LEFT JOIN subjects s ON s.id = d.subject_id
     LEFT JOIN users u ON u.id = d.owner_id
     LEFT JOIN cards c ON c.deck_id = d.id
     ${subjectId ? 'WHERE d.subject_id = ?' : ''}
     GROUP BY d.id ORDER BY d.created_at DESC`,
    subjectId ? [subjectId] : []
  );
  res.json({ decks: rows });
});

// A single deck with its cards.
router.get('/decks/:id', async (req, res) => {
  const deck = await get('SELECT * FROM decks WHERE id = ?', [req.params.id]);
  if (!deck) return res.status(404).json({ error: 'Deck not found' });
  const cards = await all('SELECT * FROM cards WHERE deck_id = ?', [deck.id]);
  res.json({ deck, cards });
});

// Create a deck (with optional inline cards).
router.post('/decks', authRequired, async (req, res) => {
  const { title, description, subjectId, cards } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const info = await run(
    'INSERT INTO decks (title, description, subject_id, owner_id) VALUES (?, ?, ?, ?)',
    [title, description || '', subjectId || null, req.user.id]
  );
  const deckId = info.lastInsertRowid;
  if (Array.isArray(cards)) {
    for (const c of cards) {
      if (c.front && c.back)
        await run('INSERT INTO cards (deck_id, front, back) VALUES (?, ?, ?)', [deckId, c.front, c.back]);
    }
  }
  const deck = await get('SELECT * FROM decks WHERE id = ?', [deckId]);
  res.json({ deck });
});

// Add a card to a deck.
router.post('/decks/:id/cards', authRequired, async (req, res) => {
  const { front, back } = req.body || {};
  if (!front || !back) return res.status(400).json({ error: 'front and back are required' });
  const info = await run('INSERT INTO cards (deck_id, front, back) VALUES (?, ?, ?)', [
    req.params.id,
    front,
    back,
  ]);
  res.json({ card: await get('SELECT * FROM cards WHERE id = ?', [info.lastInsertRowid]) });
});

// Record the result of a study session and award points.
router.post('/sessions', authRequired, async (req, res) => {
  const { deckId, cardsStudied = 0, correct = 0 } = req.body || {};
  const points = cardsStudied * 5 + correct * 5; // 5 per card seen, 5 bonus per correct
  await run(
    'INSERT INTO study_sessions (user_id, deck_id, cards_studied, correct, points_earned) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, deckId || null, cardsStudied, correct, points]
  );
  const streak = await bumpStreak(req.user.id);
  const unlocked = await awardPoints(req.user.id, points);
  await checkMilestones(req.user.id);
  res.json({ pointsEarned: points, streak, unlocked });
});

export default router;
