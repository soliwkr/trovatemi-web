const target = 'https://app.trovatemi.it/try/';
const userAgent = 'Mozilla/5.0 (compatible; TrovatemiPreviewGate/1.0; +https://trovatemi.it)';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let response;
let lastError;
for (let attempt = 1; attempt <= 3; attempt += 1) {
  try {
    response = await fetch(target, {
      headers: { 'user-agent': userAgent, accept: 'text/html' },
      redirect: 'follow',
      signal: AbortSignal.timeout(20_000),
    });
    if (response.ok) break;
    lastError = new Error(`HTTP ${response.status}`);
  } catch (error) {
    lastError = error;
  }
  if (attempt < 3) await wait(attempt * 1_000);
}

if (!response?.ok) throw new Error(`Climbo embed verification failed: ${lastError?.message ?? 'no response'}`);

const xFrameOptions = response.headers.get('x-frame-options');
const csp = response.headers.get('content-security-policy');

if (xFrameOptions && !/^allowall$/i.test(xFrameOptions.trim())) {
  throw new Error(`Climbo embed verification failed: X-Frame-Options=${xFrameOptions}`);
}

const ancestors = csp?.match(/(?:^|;)\s*frame-ancestors\s+([^;]+)/i)?.[1]?.trim();
if (ancestors) {
  const allowed = ancestors === '*' || /https:\/\/trovatemi\.it/i.test(ancestors) || /https:\/\/\*\.trovatemi\.it/i.test(ancestors) || /\bhttps:\b/i.test(ancestors);
  if (!allowed || /'none'/i.test(ancestors)) {
    throw new Error(`Climbo embed verification failed: frame-ancestors ${ancestors}`);
  }
}

const contentType = response.headers.get('content-type') || '';
if (!contentType.includes('text/html')) throw new Error(`Climbo embed verification failed: unexpected content type ${contentType}`);

const body = await response.text();
if (!body.includes('<div id="root"></div>')) throw new Error('Climbo embed verification failed: playground root marker missing');

console.log('Climbo embed verification passed');
console.log(`Status: ${response.status}`);
console.log(`X-Frame-Options: ${xFrameOptions ?? 'absent'}`);
console.log(`CSP frame-ancestors: ${ancestors ?? 'absent'}`);

