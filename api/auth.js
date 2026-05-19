module.exports = function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  var pw = process.env.DASHBOARD_PASSWORD;
  if (!pw) return res.status(500).json({ ok: false, error: 'not configured' });

  var input = '';
  var b = req.body;
  if (b) {
    if (typeof b === 'object') input = b.password || '';
    else if (typeof b === 'string') { try { input = JSON.parse(b).password || ''; } catch(e){} }
  }

  if (input === pw) {
    return res.status(200).json({ ok: true, token: 'tok_' + Date.now() });
  }
  return res.status(401).json({ ok: false, error: 'Incorrect password' });
};
