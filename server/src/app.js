import express from 'express';
import cors from 'cors';

import './db.js'; // ensure schema is initialized
import authRoutes from './routes/auth.js';
import studyRoutes from './routes/study.js';
import leaderboardRoutes from './routes/leaderboard.js';
import milestoneRoutes from './routes/milestones.js';
import questionRoutes from './routes/questions.js';
import chatRoutes from './routes/chat.js';

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/chat', chatRoutes);

export default app;
