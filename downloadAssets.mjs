/**
 * downloadAssets.mjs
 * Finds all wixstatic.com URLs in the source code and downloads them locally.
 * Then rewrites the source files to use local paths.
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, 'src');
const PUBLIC_MEDIA_DIR = path.join(__dirname, 'public', 'media');

// Ensure the media folder exists
fs.mkdirSync(PUBLIC_MEDIA_DIR, { recursive: true });

// ─── Step 1: Find all wixstatic URLs in source files ────────────────────────
const WIX_URL_RE = /https:\/\/(?:static|video)\.wixstatic\.com\/[^\s"'`)>]+/g;

function getAllSourceFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(getAllSourceFiles(full));
    else if (/\.(tsx?|mjs|js|css)$/.test(entry.name)) results.push(full);
  }
  return results;
}

const files = getAllSourceFiles(SRC_DIR);
const urlMap = new Map(); // wixUrl -> localPath

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.matchAll(WIX_URL_RE);
  for (const m of matches) {
    const url = m[0].split('?')[0]; // strip query params
    if (!urlMap.has(url)) {
      // Derive a clean filename from the URL
      const raw = url.replace(/https:\/\/[^/]+\//, '');
      const parts = raw.split('/');
      const filename = parts[parts.length - 1].replace(/[^a-zA-Z0-9._-]/g, '_');
      const localPath = `/media/${filename}`;
      urlMap.set(url, localPath);
    }
  }
}

console.log(`Found ${urlMap.size} unique wixstatic URLs. Downloading...`);

// ─── Step 2: Download each asset ────────────────────────────────────────────
async function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) { resolve(); return; }
    const file = fs.createWriteStream(dest);
    const req = https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    });
    req.on('error', (err) => { fs.existsSync(dest) && fs.unlinkSync(dest); reject(err); });
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout: ' + url)); });
  });
}

let downloaded = 0, failed = 0;
for (const [url, localPath] of urlMap) {
  const filename = path.basename(localPath);
  const dest = path.join(PUBLIC_MEDIA_DIR, filename);
  try {
    await download(url, dest);
    downloaded++;
    if (downloaded % 5 === 0) process.stdout.write(`\r  Downloaded ${downloaded}/${urlMap.size}...`);
  } catch (e) {
    console.warn(`  WARN: Failed to download ${url}: ${e.message}`);
    urlMap.delete(url); // don't rewrite if download failed
    failed++;
  }
}
console.log(`\n✓ Downloaded ${downloaded} assets, ${failed} failed.`);

// ─── Step 3: Rewrite source files to use local paths ────────────────────────
let rewritten = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [url, localPath] of urlMap) {
    const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Also replace with query params
    const re = new RegExp(escaped + '[^\\s"\'`)>]*', 'g');
    if (re.test(content)) {
      content = content.replace(re, localPath);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    rewritten++;
  }
}
console.log(`✓ Rewrote ${rewritten} source files to use local media paths.`);
console.log('Done! All static assets are now hosted locally.');
