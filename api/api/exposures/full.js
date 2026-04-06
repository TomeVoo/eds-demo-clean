import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const q = await pool.query(
      "SELECT * FROM exposure_full_mview WHERE id = $1 LIMIT 1",
      [id]
    );

    res.status(200).json(q.rows[0] || { error: "Not found" });

  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
}
