import pg from 'pg';
import { schema } from './schema.js';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    'DATABASE_URL is required (PostgreSQL connection string, e.g. postgres://user:pass@host:5432/dbname)'
  );
}

// Many hosted/remote Postgres servers require SSL. Enable it when the connection
// string asks for it, or when DATABASE_SSL=true.
const useSSL = process.env.DATABASE_SSL === 'true' || /sslmode=require/i.test(connectionString);

export const pool = new Pool({
  connectionString,
  ssl: useSSL ? { rejectUnauthorized: false } : undefined,
  max: Number(process.env.PG_POOL_MAX || 5),
});

// Postgres uses $1, $2, … placeholders; our queries are written with `?`.
function toPg(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

export async function query(sql, args = []) {
  return pool.query(toPg(sql), args);
}

export async function get(sql, args = []) {
  const r = await pool.query(toPg(sql), args);
  return r.rows[0] ?? null;
}

export async function all(sql, args = []) {
  const r = await pool.query(toPg(sql), args);
  return r.rows;
}

// For INSERTs, append `RETURNING id` in the SQL to populate lastInsertRowid.
export async function run(sql, args = []) {
  const r = await pool.query(toPg(sql), args);
  return { lastInsertRowid: r.rows[0]?.id ?? null, changes: r.rowCount };
}

// Ensure tables exist (idempotent). Top-level await runs once per cold start.
await pool.query(schema);
