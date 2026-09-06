import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const US_FILE = path.join(rootDir, 'src', 'data', 'universities', 'unitedStates.ts');
const TARGET_DIR = path.join(rootDir, 'public', 'assets', 'universities', 'us');
const MANIFEST_PATH = path.join(rootDir, 'src', 'data', 'universities', 'usMarksManifest.json');

// Ensure target dir exists
fs.mkdirSync(TARGET_DIR, { recursive: true });

// Helper to extract 100 university entries from unitedStates.ts
function getUniversityRecords() {
  const content = fs.readFileSync(US_FILE, 'utf8');
  const records = [];
  const regex = /id:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"],\s*aliases:\s*(\[[^\]]*\]),\s*country:\s*['"]([^'"]+)['"],\s*institutionType:\s*['"]([^'"]+)['"],\s*officialWebsite:\s*['"]([^'"]+)['"]/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    let aliases = [];
    try {
      aliases = JSON.parse(match[3].replace(/'/g, '"'));
    } catch {
      aliases = [];
    }
    records.push({
      id: match[1],
      name: match[2],
      aliases,
      country: match[4],
      institutionType: match[5],
      officialWebsite: match[6]
    });
  }
  return records;
}

// Extract potential icons from HTML
function extractIconsFromHtml(html, baseUrl) {
  const candidates = [];

  // 1. Apple Touch Icon
  const appleTouchRegex = /<link[^>]*rel=["'](?:apple-touch-icon(?:-precomposed)?|apple-touch-icon)["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = appleTouchRegex.exec(html)) !== null) {
    try {
      const resolved = new URL(match[1], baseUrl).href;
      candidates.push({ url: resolved, type: 'apple-touch-icon' });
    } catch {}
  }
  
  // Also reverse attribute order <link href="..." rel="apple-touch-icon">
  const appleTouchRevRegex = /<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:apple-touch-icon(?:-precomposed)?|apple-touch-icon)["'][^>]*>/gi;
  while ((match = appleTouchRevRegex.exec(html)) !== null) {
    try {
      const resolved = new URL(match[1], baseUrl).href;
      candidates.push({ url: resolved, type: 'apple-touch-icon' });
    } catch {}
  }

  // 2. High-res icon / standard site icons
  const iconRegex = /<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  while ((match = iconRegex.exec(html)) !== null) {
    try {
      const resolved = new URL(match[1], baseUrl).href;
      candidates.push({ url: resolved, type: 'site-icon' });
    } catch {}
  }
  const iconRevRegex = /<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:icon|shortcut icon)["'][^>]*>/gi;
  while ((match = iconRevRegex.exec(html)) !== null) {
    try {
      const resolved = new URL(match[1], baseUrl).href;
      candidates.push({ url: resolved, type: 'site-icon' });
    } catch {}
  }

  // 3. Fallbacks directly at domain root
  try {
    const origin = new URL(baseUrl).origin;
    candidates.push({ url: `${origin}/apple-touch-icon.png`, type: 'apple-touch-icon' });
    candidates.push({ url: `${origin}/favicon.ico`, type: 'site-icon' });
  } catch {}

  // Deduplicate by URL
  const seen = new Set();
  const unique = [];
  for (const c of candidates) {
    if (!seen.has(c.url)) {
      seen.add(c.url);
      unique.push(c);
    }
  }

  return unique;
}

// Determine safe extension and mime
function getSafeExtension(contentType, url) {
  const ct = (contentType || '').toLowerCase();
  if (ct.includes('image/png')) return '.png';
  if (ct.includes('image/webp')) return '.webp';
  if (ct.includes('image/jpeg') || ct.includes('image/jpg')) return '.jpg';
  if (ct.includes('image/x-icon') || ct.includes('image/vnd.microsoft.icon') || ct.includes('image/ico')) return '.ico';
  if (ct.includes('image/svg+xml')) return null; // Reject remote SVGs unless strictly sanitized

  // Check URL pathname
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    if (pathname.endsWith('.png')) return '.png';
    if (pathname.endsWith('.webp')) return '.webp';
    if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) return '.jpg';
    if (pathname.endsWith('.ico')) return '.ico';
  } catch {}

  return null;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 7000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,image/png,image/*;q=0.8',
        ...(options.headers || {})
      }
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function processUniversity(uni) {
  const domain = uni.officialWebsite;
  const manifestRecord = {
    universityId: uni.id,
    officialDomain: domain,
    localAssetPath: undefined,
    sourceUrl: undefined,
    sourceType: 'unresolved',
    reviewed: false
  };

  try {
    console.log(`[Fetching] ${uni.name} (${domain})...`);
    const pageRes = await fetchWithTimeout(domain, {}, 8000);
    if (!pageRes.ok) {
      console.warn(`  [Warning] HTTP ${pageRes.status} for ${domain}`);
    }

    const html = pageRes.ok ? await pageRes.text() : '';
    const candidates = extractIconsFromHtml(html, domain);

    // Try each candidate icon in order
    for (const cand of candidates) {
      // Reject non-image extensions in candidate URL if obvious
      if (cand.url.toLowerCase().endsWith('.svg')) continue;

      try {
        const imgRes = await fetchWithTimeout(cand.url, {
          headers: { 'Accept': 'image/png,image/webp,image/jpeg,image/*;q=0.9' }
        }, 6000);

        if (!imgRes.ok) continue;

        const contentType = imgRes.headers.get('content-type') || '';
        if (contentType.includes('text/html') || contentType.includes('application/json')) {
          // Reject HTML error pages
          continue;
        }

        const ext = getSafeExtension(contentType, cand.url);
        if (!ext) continue;

        const buffer = Buffer.from(await imgRes.arrayBuffer());

        // Validate size: between 200 bytes and 1MB (reject 1-pixel trackers & huge images)
        if (buffer.length < 200 || buffer.length > 1024 * 1024) {
          continue;
        }

        const filename = `${uni.id}${ext}`;
        const localPath = path.join(TARGET_DIR, filename);
        fs.writeFileSync(localPath, buffer);

        manifestRecord.localAssetPath = `/assets/universities/us/${filename}`;
        manifestRecord.sourceUrl = cand.url;
        manifestRecord.sourceType = cand.type;
        manifestRecord.reviewed = false;

        console.log(`  [OK] Saved ${filename} (${buffer.length} bytes) from ${cand.url}`);
        return manifestRecord;
      } catch (err) {
        // Try next candidate
      }
    }
  } catch (err) {
    console.warn(`  [Failed] Could not access ${domain}: ${err.message}`);
  }

  return manifestRecord;
}

async function main() {
  const universities = getUniversityRecords();
  console.log(`Found ${universities.length} US Universities.`);

  const manifest = [];
  let resolvedCount = 0;
  let unresolvedCount = 0;

  // Process in small batches of 6 for speed and polite concurrency
  const batchSize = 6;
  for (let i = 0; i < universities.length; i += batchSize) {
    const batch = universities.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(uni => processUniversity(uni)));
    for (const res of results) {
      manifest.push(res);
      if (res.localAssetPath) {
        resolvedCount++;
      } else {
        unresolvedCount++;
      }
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');

  console.log('\n=======================================');
  console.log(`Finished processing ${universities.length} universities.`);
  console.log(`Resolved local site icons: ${resolvedCount}`);
  console.log(`Unresolved (monogram fallback): ${unresolvedCount}`);
  console.log(`Manifest written to: ${MANIFEST_PATH}`);
  console.log('=======================================\n');
}

main().catch(console.error);
