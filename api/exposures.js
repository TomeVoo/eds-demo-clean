import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,          // ← TO JEST KLUCZOWE
  max: 1              // ← bardzo ważne dla serverless
});

export default async function handler(req, res) {
  try {
    const q = await pool.query(
      "SELECT id, name FROM exposures ORDER BY id"
    );
    res.status(200).json(q.rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: String(err) });
  }
}
