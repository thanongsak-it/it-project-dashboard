/**
 * Local development server
 * Usage:
 *   1. Copy .env.example → .env and fill in NOTION_TOKEN
 *   2. npm install
 *   3. node server.js
 *   4. Open http://localhost:3000
 */

require('dotenv').config();          // loads .env file
const express = require('express');
const path    = require('path');
const notionHandler = require('./api/notion');

const app  = express();
const PORT = process.env.PORT || 3000;

// Serve static files (dashboard HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Proxy Notion API
app.get('/api/notion', (req, res) => notionHandler(req, res));

// Fallback → index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🖥️  IT Project Dashboard running at http://localhost:${PORT}`);
  console.log(`   Notion token: ${process.env.NOTION_TOKEN ? '✓ set' : '✗ NOT SET — add to .env'}\n`);
});
