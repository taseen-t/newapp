import bcrypt from 'bcryptjs';
import { pathToFileURL } from 'url';
import { client, run, get } from './db.js';

export async function seedDatabase() {
  console.log('Seeding MedStudy database...');

  // Reset content tables (fresh demo data).
  await client.executeMultiple(`
    DELETE FROM user_milestones;
    DELETE FROM milestones;
    DELETE FROM answers;
    DELETE FROM questions;
    DELETE FROM messages;
    DELETE FROM rooms;
    DELETE FROM study_sessions;
    DELETE FROM cards;
    DELETE FROM decks;
    DELETE FROM subjects;
    DELETE FROM users;
  `);

  // --- Subjects ---
  const subjects = [
    ['Anatomy', '🦴', '#ef4444'],
    ['Physiology', '❤️', '#ec4899'],
    ['Pharmacology', '💊', '#8b5cf6'],
    ['Pathology', '🔬', '#f59e0b'],
    ['Microbiology', '🦠', '#10b981'],
    ['Biochemistry', '🧬', '#3b82f6'],
  ];
  const subjectIds = {};
  for (const [name, icon, color] of subjects) {
    const info = await run('INSERT INTO subjects (name, icon, color) VALUES (?, ?, ?)', [name, icon, color]);
    subjectIds[name] = info.lastInsertRowid;
  }

  // --- Users ---
  const hash = (p) => bcrypt.hashSync(p, 10);
  const today = new Date().toISOString().slice(0, 10);
  const demoUsers = [
    ['drsarah', 'sarah@medstudy.io', 'password123', '#ef4444', 'PGY-2 Internal Medicine. Cardiology nerd.', 1240, 12],
    ['mike_md', 'mike@medstudy.io', 'password123', '#3b82f6', 'Med student, year 3. Surviving on coffee.', 980, 7],
    ['anatomy_ace', 'ace@medstudy.io', 'password123', '#10b981', 'Anatomy TA. Ask me about the brachial plexus.', 1530, 21],
    ['pharma_pia', 'pia@medstudy.io', 'password123', '#8b5cf6', 'Pharmacology obsessed. Beta blockers > everything.', 760, 4],
    ['nina_neuro', 'nina@medstudy.io', 'password123', '#f59e0b', 'Neuro resident. The brain is the best organ.', 420, 3],
  ];
  const userIds = {};
  for (const [u, e, p, a, bio, pts, streak] of demoUsers) {
    const info = await run(
      'INSERT INTO users (username, email, password_hash, avatar, bio, points, streak, last_study_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [u, e, hash(p), a, bio, pts, streak, today]
    );
    userIds[u] = info.lastInsertRowid;
  }

  // --- Decks + Cards ---
  async function deck(subject, owner, title, desc, cards) {
    const info = await run('INSERT INTO decks (subject_id, owner_id, title, description) VALUES (?, ?, ?, ?)', [
      subjectIds[subject],
      userIds[owner],
      title,
      desc,
    ]);
    for (const [front, back] of cards) {
      await run('INSERT INTO cards (deck_id, front, back) VALUES (?, ?, ?)', [info.lastInsertRowid, front, back]);
    }
  }

  await deck('Anatomy', 'anatomy_ace', 'Brachial Plexus Essentials', 'Roots, trunks, divisions, cords.', [
    ['What are the 5 roots of the brachial plexus?', 'Ventral rami of C5, C6, C7, C8, and T1.'],
    ['Which nerve arises from the posterior cord and innervates the deltoid?', 'The axillary nerve (C5–C6).'],
    ['Erb-Duchenne palsy affects which roots?', 'Upper roots C5–C6 ("waiter\'s tip" posture).'],
    ['The musculocutaneous nerve innervates which compartment?', 'The anterior compartment of the arm (biceps, brachialis, coracobrachialis).'],
  ]);
  await deck('Physiology', 'drsarah', 'Cardiac Cycle', 'Pressures, valves, and heart sounds.', [
    ['What causes the first heart sound (S1)?', 'Closure of the mitral and tricuspid (AV) valves.'],
    ['What causes the second heart sound (S2)?', 'Closure of the aortic and pulmonary (semilunar) valves.'],
    ['During which phase is ventricular volume highest?', 'End of diastole (end-diastolic volume).'],
    ['What is the normal ejection fraction range?', 'Approximately 55–70%.'],
  ]);
  await deck('Pharmacology', 'pharma_pia', 'Autonomic Drugs', 'Cholinergics & adrenergics.', [
    ['Mechanism of atropine?', 'Competitive muscarinic acetylcholine receptor antagonist.'],
    ['What receptor does albuterol primarily act on?', 'Beta-2 adrenergic receptors (bronchodilation).'],
    ['Antidote for organophosphate poisoning?', 'Atropine plus pralidoxime (2-PAM).'],
    ['Propranolol blocks which receptors?', 'Beta-1 and beta-2 adrenergic receptors (non-selective).'],
  ]);
  await deck('Microbiology', 'mike_md', 'Gram-Positive Cocci', 'Staph & strep high-yield.', [
    ['Catalase test distinguishes which two genera?', 'Staphylococcus (positive) from Streptococcus (negative).'],
    ['Coagulase-positive Staphylococcus species?', 'Staphylococcus aureus.'],
    ['Which strep is bacitracin sensitive?', 'Group A strep (S. pyogenes).'],
    ['Optochin sensitivity identifies which organism?', 'Streptococcus pneumoniae.'],
  ]);

  // --- Chat rooms ---
  const rooms = [
    ['General', 'Talk about anything med-school related'],
    ['Exam Prep', 'USMLE, NEET-PG, and board exam strategies'],
    ['Anatomy', 'Bones, muscles, nerves — the works'],
    ['Clinical Cases', 'Discuss interesting patient presentations'],
    ['Study Buddies', 'Find a partner and keep each other accountable'],
  ];
  const roomIds = [];
  for (const [n, d] of rooms) {
    const info = await run('INSERT INTO rooms (name, description) VALUES (?, ?)', [n, d]);
    roomIds.push(info.lastInsertRowid);
  }

  const msg = (room, user, content, offset) =>
    run("INSERT INTO messages (room_id, user_id, content, created_at) VALUES (?, ?, ?, datetime('now', ?))", [
      room,
      user,
      content,
      offset,
    ]);
  await msg(roomIds[0], userIds['anatomy_ace'], 'Welcome to MedStudy! Drop your study goals for the week 👇', '-2 hours');
  await msg(roomIds[0], userIds['drsarah'], 'Goal: finish the entire cardiac phys deck and review ECGs.', '-110 minutes');
  await msg(roomIds[0], userIds['mike_md'], 'I am aiming for 100 micro flashcards a day this week.', '-90 minutes');
  await msg(roomIds[1], userIds['pharma_pia'], 'Best resource for autonomic pharm? My brain is melting.', '-60 minutes');
  await msg(roomIds[1], userIds['anatomy_ace'], 'Make a chart of receptor → drug → effect. Game changer.', '-55 minutes');

  // --- Milestones ---
  const milestones = [
    ['first_steps', 'First Steps', 'Earn your first 50 points', 'sparkles', 50, 'points'],
    ['rising_star', 'Rising Star', 'Reach 500 points', 'star', 500, 'points'],
    ['scholar', 'Scholar', 'Reach 1,000 points', 'graduation', 1000, 'points'],
    ['legend', 'Legend', 'Reach 2,500 points', 'crown', 2500, 'points'],
    ['streak_3', 'Consistent', 'Maintain a 3-day study streak', 'flame', 3, 'streak'],
    ['streak_7', 'On Fire', 'Maintain a 7-day study streak', 'flame', 7, 'streak'],
    ['streak_30', 'Unstoppable', 'Maintain a 30-day study streak', 'flame', 30, 'streak'],
    ['cards_50', 'Card Crusher', 'Study 50 flashcards', 'cards', 50, 'cards_studied'],
    ['cards_250', 'Memory Master', 'Study 250 flashcards', 'cards', 250, 'cards_studied'],
    ['curious', 'Curious Mind', 'Ask your first question', 'question', 1, 'questions'],
    ['helper', 'Helping Hand', 'Post 5 answers', 'hands', 5, 'answers'],
    ['mentor', 'Mentor', 'Post 20 answers', 'hands', 20, 'answers'],
  ];
  for (const m of milestones) {
    await run('INSERT INTO milestones (key, title, description, icon, threshold, metric) VALUES (?, ?, ?, ?, ?, ?)', m);
  }

  console.log('Seed complete.');
}

// Run directly (CLI): `npm run seed`
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  seedDatabase()
    .then(() => {
      console.log('Demo logins (password: password123): drsarah, mike_md, anatomy_ace, pharma_pia, nina_neuro');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
