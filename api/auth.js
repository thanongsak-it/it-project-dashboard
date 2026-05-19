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
  if (req.method !== 'POST')    { res.status(405).json({ error: 'Method not allowed' }); return; }

  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) {
    res.status(500).json({ error: 'DASHBOARD_PASSWORD not configured' });
    return;
  }

  let body = '';
  if (typeof req.body === 'object') {
    body = req.body;
  } else {
    try {
      body = JSON.parse(req.body || '{}');
    } catch(e) {
      body = {};
    }
  }

  const input = body.password || '';

  if (input === password) {
    /* Simple session token: hash of password + today's date (rotates daily) */
    const today  = new Date().toISOString().slice(0, 10);  /* YYYY-MM-DD */
    const raw    = password + ':' + today;
    /* Lightweight hash — enough for internal tool */
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash |= 0;
    }
    const token = Math.abs(hash).toString(36) + today.replace(/-/g, '');

    res.status(200).json({ ok: true, token });
  } else {
    res.status(401).json({ ok: false, error: 'Incorrect password' });
  }
};
