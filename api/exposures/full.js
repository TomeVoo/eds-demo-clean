import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  max: 1
});

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const q = await pool.query(
      "SELECT * FROM exposure_full_mview WHERE id = $1",
      [id]
    );
    res.status(200).json(q.rows[0] || {});
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: String(err) });
  }
}
