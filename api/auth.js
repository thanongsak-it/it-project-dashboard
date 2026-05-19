/**
 * POST /api/auth
 * Body: { password: "..." }
 * Returns: { ok: true, token: "..." } or { ok: false, error: "..." }
 */
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) {
    res.status(500).json({ ok: false, error: 'DASHBOARD_PASSWORD not configured' });
    return;
  }

  /* Parse body — Vercel sends it as a stream, need to collect chunks */
  let input = '';
  try {
    if (typeof req.body === 'object' && req.body !== null) {
      /* Already parsed (Vercel sometimes pre-parses JSON) */
      input = req.body.password || '';
    } else {
      /* Parse raw stream */
      const rawBody = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => { data += chunk.toString(); });
        req.on('end', () => resolve(data));
        req.on('error', reject);
      });
      const parsed = JSON.parse(rawBody || '{}');
      input = parsed.password || '';
    }
  } catch (e) {
    res.status(400).json({ ok: false, error: 'Invalid request body' });
    return;
  }

  if (input === password) {
    /* Session token: lightweight hash + today's date (rotates daily) */
    c