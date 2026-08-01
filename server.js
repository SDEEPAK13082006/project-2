/* ==========================================================================
   OUR LOVE QUIZ ❤️ - NATIVE NODE.JS BACKEND SERVER (ZERO DEPENDENCIES)
   ========================================================================== */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const RESULTS_FILE = path.join(__dirname, 'data', 'results.json');

// MIME types for static file serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon'
};

// Ensure results.json exists
function ensureResultsFile() {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(RESULTS_FILE)) {
    fs.writeFileSync(RESULTS_FILE, JSON.stringify([], null, 2));
  }
}

function getResults() {
  ensureResultsFile();
  try {
    const raw = fs.readFileSync(RESULTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function saveResults(results) {
  ensureResultsFile();
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
}

// HTTP Server Listener
const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // API 1: Submit Results (POST /api/results)
  if (pathname === '/api/results' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { partnerNickname, senderName, score, totalQuestions, tierMessage, answers } = payload;

        if (score === undefined || !partnerNickname) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Missing required fields' }));
          return;
        }

        const newSubmission = {
          id: 'res_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
          partnerNickname: partnerNickname || 'My Sweetheart',
          senderName: senderName || 'Your Love',
          score: Number(score),
          totalQuestions: Number(totalQuestions) || 20,
          percentage: Math.round((Number(score) / (Number(totalQuestions) || 20)) * 100),
          tierMessage: tierMessage || '',
          answers: answers || [],
          submittedAt: new Date().toISOString()
        };

        const results = getResults();
        results.unshift(newSubmission);
        saveResults(results);

        console.log(`❤️ Quiz Result Saved: ${newSubmission.partnerNickname} scored ${newSubmission.score}/${newSubmission.totalQuestions}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Result saved successfully ❤️', data: newSubmission }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // API 2: Get Submissions (GET /api/results)
  if (pathname === '/api/results' && req.method === 'GET') {
    const results = getResults();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: results.length, data: results }));
    return;
  }

  // Static File Serving
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

  // Security check to prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA routing
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end('500 Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    });
  });
});

const os = require('os');

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

server.listen(PORT, () => {
  const localIp = getLocalIpAddress();
  console.log(`
=====================================================
❤️ OUR LOVE QUIZ NATIVE SERVER RUNNING ON PORT ${PORT} ❤️
- Local Access:   http://localhost:${PORT}
- Mobile Wi-Fi:   http://${localIp}:${PORT}
- Results API:    http://localhost:${PORT}/api/results
=====================================================
  `);
});

module.exports = server;
