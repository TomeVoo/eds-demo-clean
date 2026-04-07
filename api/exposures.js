import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  try {
    const q = await pool.query(
      "SELECT id, name FROM exposures ORDER BY id"
    );
    res.status(200).json(q.rows);
 } catch (err) {
  console.error("PG ERROR:", err);

  return res.status(500).json({
    name: err?.name,
    message: err?.message,
    code: err?.code,
    details: err?.detail,
    stack: err?.stack,
    raw: String(err)
  });
}
