// Post-deployment checks on a live URL, with no cookies: what a private window sees.
//
//   node scripts/check-live.mjs https://your-app.vercel.app
//   SESSION_SECRET=… PAYMENT_WEBHOOK_SECRET=… node scripts/check-live.mjs https://your-app.vercel.app
//
// With the secrets set (they stay on your machine), it also searches every JavaScript file the
// pages load for their values. The by-hand checks are listed in the README.
const base = (process.argv[2] ?? '').replace(/\/$/, '');
if (!/^https?:\/\//.test(base)) {
  console.error('Usage: node scripts/check-live.mjs https://your-app.vercel.app');
  process.exit(1);
}

let failed = 0;
const report = (ok, name, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? `  (${detail})` : ''}`);
};
async function check(name, path, init, test) {
  try {
    const res = await fetch(base + path, { redirect: 'manual', ...init });
    const body = await res.text();
    const problem = test(res, body);
    report(!problem, name, problem || String(res.status));
  } catch (error) {
    report(false, name, error.message);
  }
}
const is = (code) => (res) => (res.status === code ? null : `got ${res.status}, expected ${code}`);
const json = { 'Content-Type': 'application/json' };
const meta = (html, key) => html.match(new RegExp(`<meta[^>]+(?:property|name)="${key}"[^>]+content="([^"]*)"`))?.[1];

console.log(`Checking ${base}\n`);
report(base.startsWith('https://'), 'served over HTTPS');

// Pages, as a first-time visitor sees them.
await check('home page', '/', {}, (res, body) => (res.status === 200 && body.includes('Addis Eats') ? null : `got ${res.status}`));
await check('menu', '/menu', {}, is(200));
await check('a dish page', '/menu/kitfo', {}, (res, body) => (res.status === 200 && body.includes('Kitfo') ? null : `got ${res.status}`));
await check('unknown dish → real 404', '/menu/not-a-dish', {}, is(404));
await check('unknown page → real 404', '/no-such-page', {}, is(404));
await check('cart and wishlist load', '/cart', {}, is(200));
await check('checkout loads with an empty cart', '/checkout', {}, is(200));

// The API and its guards.
await check('GET /api/dishes', '/api/dishes', {}, (res, body) => (res.status === 200 && body.startsWith('[') ? null : `got ${res.status}`));
await check('unknown dish → 404 JSON', '/api/dishes/not-a-dish', {}, is(404));
await check('unknown category → 400', '/api/dishes?category=Pizza', {}, is(400));
await check('order with bad JSON → 400', '/api/orders', { method: 'POST', headers: json, body: 'not json' }, is(400));
await check('invalid order → 422', '/api/orders', { method: 'POST', headers: json, body: '{"name":"Almaz","phone":"0912"}' }, is(422));
await check('reading an order with no session → 401', '/api/orders/AE-00000000', {}, is(401));
await check('webhook with a bad signature → 401', '/api/payments/confirm', { method: 'POST', headers: { ...json, 'x-addis-signature': 'deadbeef' }, body: '{"orderId":"AE-00000000","reference":"X"}' }, is(401));

// Search engines and link previews.
await check('robots.txt', '/robots.txt', {}, (res, body) => (res.status === 200 && body.includes('Sitemap') ? null : `got ${res.status}`));
await check('sitemap.xml uses this address', '/sitemap.xml', {}, (res, body) => (res.status === 200 && body.includes(new URL(base).host) ? null : 'sitemap URLs point elsewhere: was the build made for this address?'));
try {
  const page = await (await fetch(`${base}/menu/kitfo`)).text();
  const image = meta(page, 'og:image');
  report(Boolean(meta(page, 'og:title')), 'og:title on a dish page', meta(page, 'og:title'));
  report(meta(page, 'twitter:card') === 'summary_large_image', 'large-image link card', meta(page, 'twitter:card'));
  report(Boolean(image?.startsWith(base)), 'og:image is an absolute URL on this site', image);
  if (image) {
    const res = await fetch(image.replace(/&amp;/g, '&'));
    report(res.ok && (res.headers.get('content-type') ?? '').startsWith('image/'), 'the card image loads', `${res.status} ${res.headers.get('content-type')}`);
  }
} catch (error) {
  report(false, 'link card', error.message);
}

// No secret in the JavaScript a browser downloads.
try {
  const files = new Set();
  for (const path of ['/', '/menu', '/menu/kitfo', '/cart', '/checkout']) {
    const html = await (await fetch(base + path)).text();
    for (const m of html.matchAll(/<script[^>]+src="([^"]+\.js[^"]*)"/g)) files.add(m[1]);
  }
  const values = [process.env.SESSION_SECRET, process.env.PAYMENT_WEBHOOK_SECRET].filter(Boolean);
  const hits = [];
  let bytes = 0;
  for (const file of files) {
    const js = await (await fetch(new URL(file, base))).text();
    bytes += js.length;
    if (/SESSION_SECRET|PAYMENT_WEBHOOK_SECRET/.test(js) || values.some((v) => js.includes(v))) hits.push(file);
  }
  report(hits.length === 0, `no secret in the ${files.size} JavaScript files the pages load`, hits.join(', ') || `${Math.round(bytes / 1024)} KB searched for the names${values.length ? ` and ${values.length} value(s)` : ''}`);
} catch (error) {
  report(false, 'JavaScript secret scan', error.message);
}

console.log(failed ? `\n${failed} check(s) failed.` : '\nAll automatic checks passed. Now the by-hand list in the README, in a private window.');
process.exit(failed ? 1 : 0);
