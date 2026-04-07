export default async function handler(req, res) {
  res.status(200).json({
    databaseUrlExists: !!process.env.DATABASE_URL,
    databaseUrlValue: process.env.DATABASE_URL || null,
    nodeEnv: process.env.NODE_ENV || null
  });
}
``
