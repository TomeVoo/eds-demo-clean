export default async function handler(req, res) {
  return res.status(200).json({
    supabaseUrlExists: Boolean(process.env.SUPABASE_URL),
    supabaseAnonKeyExists: Boolean(process.env.SUPABASE_ANON_KEY),
    supabaseUrl: process.env.SUPABASE_URL || null,
    nodeEnv: process.env.NODE_ENV || null
  });
}
