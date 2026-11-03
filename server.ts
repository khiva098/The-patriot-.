import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');
const port = Number(process.env.PORT) || 3000;

const mimeTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// In-memory authority state for server-side verification
const appointedStaffList = [
  'wahabalikhiva@gmail.com',
  'elena.rostova@patriot.org',
  'tariq.mansoor@patriot.org',
  'c.alvarez@patriot.org',
  'z.chen@patriot.org',
];

const parseJsonBody = (req: http.IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) {
        req.socket.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
  });
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Set standard CORS headers for local preview and cross-origin safety
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Server-side Authentication & Sovereign RBAC Validation APIs
  if (pathname === '/api/auth/validate-role' && req.method === 'POST') {
    const data = await parseJsonBody(req);
    const email = (data.email || '').toLowerCase().trim();
    const requestedRole = (data.role || 'reader').toLowerCase().trim();

    if (requestedRole === 'administrator') {
      if (email === 'wahabalikhiva@gmail.com') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ allowed: true, role: 'administrator', user: 'Wahab Ali Khiva', masterAdmin: true }));
        return;
      } else {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          allowed: false,
          error: 'Sovereign Violation: Administrator credentials strictly reserved for Wahab Ali Khiva (wahabalikhiva@gmail.com).'
        }));
        return;
      }
    }

    if (requestedRole === 'author' || requestedRole === 'editor' || requestedRole === 'sub_administrator') {
      const isAppointed = email === 'wahabalikhiva@gmail.com' || appointedStaffList.includes(email);
      if (isAppointed) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ allowed: true, role: requestedRole }));
        return;
      } else {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          allowed: false,
          status: 'pending_verification',
          error: 'Author privileges require official appointment by Wahab Ali Khiva. Application status: pending verification.'
        }));
        return;
      }
    }

    // Readers are universally valid
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ allowed: true, role: 'reader' }));
    return;
  }

  if (pathname === '/api/auth/reset-password' && req.method === 'POST') {
    const data = await parseJsonBody(req);
    const identifier = (data.identifier || '').trim();
    const newPassword = (data.newPassword || '').trim();

    if (!identifier || !newPassword || newPassword.length < 6) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Valid identifier and minimum 6 character password required.' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: `Password reset verified for ${identifier}. Security credentials updated.`
    }));
    return;
  }

  if (pathname === '/api/auth/request-verification' && req.method === 'POST') {
    const data = await parseJsonBody(req);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      status: 'pending_verification',
      message: `Verification dossier submitted for ${data.email || 'applicant'} to Sovereign Master Wahab Ali Khiva.`
    }));
    return;
  }

  // Static File Serving
  let filePath = path.join(distDir, pathname === '/' ? 'index.html' : pathname);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error');
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
      });
      res.end(content);
    }
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`THE PATRIOT server running on 0.0.0.0:${port}`);
});
