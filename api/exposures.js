import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  try {
    const q = await pool.query("SELECT id, name FROM exposures ORDER BY id");
    res.status(200).json(q.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.toString() });
  }
}
