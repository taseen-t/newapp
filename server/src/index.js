import './env.js';
import app from './app.js';
import { get } from './db.js';
import { seedDatabase } from './seed.js';

const PORT = process.env.PORT || 4000;

// Local convenience: seed the file database on first run when it's empty.
// (On Turso/production, run `npm run seed` once with the DB env vars set.)
const usingFileDb = !process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('file:');
if (usingFileDb) {
  const { c } = await get('SELECT COUNT(*) AS c FROM users');
  if (c === 0) await seedDatabase();
}

app.listen(PORT, () => {
  console.log(`MedStudy API running on http://localhost:${PORT}`);
});
