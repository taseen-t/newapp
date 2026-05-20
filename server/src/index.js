import './env.js';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import db from './db.js';
import { verifyToken } from './auth.js';
import { awardPoints } from './points.js';

import authRoutes from './routes/auth.js';
import studyRoutes from './routes/study.js';
import leaderboardRoutes from './routes/leaderboard.js';
import milestoneRoutes from './routes/milestones.js';
import questionRoutes from './routes/questions.js';
import chatRoutes from './routes/chat.js';

const PORT = process.env.PORT || 4000;
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

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: CLIENT_ORIGIN } });

// Authenticate socket connections via JWT.
io.use((socket, next) => {
  const payload = verifyToken(socket.handshake.auth?.token);
  if (!payload) return next(new Error('Unauthorized'));
  socket.user = payload;
  next();
});

io.on('connection', (socket) => {
  socket.on('room:join', (roomId) => {
    for (const r of socket.rooms) if (r !== socket.id) socket.leave(r);
    socket.join(`room:${roomId}`);
  });

  socket.on('message:send', ({ roomId, content }) => {
    const text = (content || '').trim();
    if (!text || !roomId) return;
    const info = db
      .prepare('INSERT INTO messages (room_id, user_id, content) VALUES (?, ?, ?)')
      .run(roomId, socket.user.id, text.slice(0, 2000));
    const message = db
      .prepare(
        `SELECT m.*, u.username, u.avatar FROM messages m
         JOIN users u ON u.id = m.user_id WHERE m.id = ?`
      )
      .get(info.lastInsertRowid);
    awardPoints(socket.user.id, 1); // small reward for participation
    io.to(`room:${roomId}`).emit('message:new', message);
  });
});

httpServer.listen(PORT, () => {
  console.log(`MedStudy API + chat running on http://localhost:${PORT}`);
});
