// Checks a deployed Addis Eats as a first-time visitor in a private window meets it: no cookies,
// nothing cached.
//
//   node scripts/verify-deploy.mjs https://your-app.vercel.app
//   SESSION_SECRET=<production value> node scripts/verify-deploy.mjs https://your-app.vercel.app
//
// With SESSION_SECRET set (it never leaves your machine), it also searches every JavaScript file
// the pages load for the secret's value. The signed-in checks are a manual list in SHIP.md.
const site = (process.argv[2] ?? '').replace(/\/$/, '');
if (!/^https?:\/\//.test(site)) {
  console.error('Usage: node scripts/verify-deploy.mjs https://your-app.vercel.app');
  process.exit(1);
}

const toSignIn = (res) => res.status >= 300 && res.status < 400 && (res.headers.get('location') ?? '').includes('/sign-in');
const metaTag = (html, key) => html.match(new RegExp(`<meta[^>]+(?:property|name)="${key}"[^>]+content="([^"]*)"`))?.[1];

// [what, path, request options, passes(response, body)]
const CHECKS = [
  ['served over HTTPS', '/', {}, () => site.startsWith('https://')],
  ['home page', '/', {}, (res, body) => res.status === 200 && body.includes('Addis')],
  ['menu', '/menu', {}, (res) => res.status === 200],
  ['a prerendered dish', '/menu/doro-wat', {}, (res, body) => res.status === 200 && body.includes('Doro Wat')],
  ['unknown dish → real 404', '/menu/no-such-dish', {}, (res) => res.status === 404],
  ['unknown page → real 404', '/no-such-page', {}, (res) => res.status === 404],
  ['/orders → sign-in', '/orders', {}, toSignIn],
  ['/checkout → sign-in', '/checkout', {}, toSignIn],
  ['/kitchen → sign-in', '/kitchen', {}, toSignIn],
  ['nobody signed in', '/api/session', {}, (res, body) => res.status === 200 && body.includes('"user":null')],
  ['order API refuses a stranger', '/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }, (res) => res.status === 401],
  ['live feed refuses a stranger', '/api/orders/AE-0/events', {}, (res) => res.status === 401],
  ['history CSV refuses a stranger', '/orders/history.csv', {}, (res) => res.status === 401 || toSignIn(res)],
  ['robots.txt', '/robots.txt', {}, (res, body) => res.status === 200 && body.includes('Sitemap')],
  ['sitemap uses this address', '/sitemap.xml', {}, (res, body) => res.status === 200 && body.includes(new URL(site).host)],
  // A shared link becomes a card: the tags exist and the image is an absolute URL on this site.
  ['dish page: og:title', '/menu/doro-wat', {}, (res, body) => Boolean(metaTag(body, 'og:title'))],
  ['dish page: large-image card', '/menu/doro-wat', {}, (res, body) => metaTag(body, 'twitter:card') === 'summary_large_image'],
  ['dish page: og:image on this site', '/menu/doro-wat', {}, (res, body) => (metaTag(body, 'og:image') ?? '').startsWith(site)],
];

let failures = 0;
const line = (ok, what, detail) => {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${what.padEnd(34)} ${detail}`);
};

console.log(`Verifying ${site}\n`);
for (const [what, path, init, passes] of CHECKS) {
  try {
    const res = await fetch(site + path, { redirect: 'manual', ...init });
    const body = res.status >= 300 && res.status < 400 ? '' : await res.text();
    line(passes(res, body), what, `${res.status} ${path}`);
  } catch (error) {
    line(false, what, error.message);
  }
}

// The card's image itself must load.
try {
  const page = await (await fetch(`${site}/menu/doro-wat`)).text();
  const image = metaTag(page, 'og:image')?.replace(/&amp;/g, '&');
  const res = image ? await fetch(image) : null;
  line(Boolean(res?.ok && res.headers.get('content-type')?.startsWith('image/')), 'card image loads', res ? `${res.status} ${res.headers.get('content-type')}` : 'no og:image');
} catch (error) {
  line(false, 'card image loads', error.message);
}

// No secret in any JavaScript the browser downloads.
try {
  const files = new Set();
  for (const path of ['/', '/menu', '/menu/doro-wat', '/sign-in']) {
    const html = await (await fetch(site + path)).text();
    for (const m of html.matchAll(/<script[^>]+src="([^"]+\.js[^"]*)"/g)) files.add(m[1]);
  }
  const secret = process.env.SESSION_SECRET;
  const found = [];
  let bytes = 0;
  for (const file of files) {
    const js = await (await fetch(new URL(file, site))).text();
    bytes += js.length;
    if (js.includes('SESSION_SECRET') || (secret && js.includes(secret))) found.push(file);
  }
  line(found.length === 0, `no secret in ${files.size} JS files`, found.join(', ') || `${Math.round(bytes / 1024)} KB searched for the name${secret ? ' and the value' : ''}`);
} catch (error) {
  line(false, 'JS secret scan', error.message);
}

// Build files cached for a year.
try {
  const html = await (await fetch(site + '/')).text();
  const file = html.match(/\/_next\/static\/[^"']+\.js/)?.[0];
  const cache = file ? (await fetch(site + file)).headers.get('cache-control') ?? '' : '';
  line(cache.includes('immutable'), 'build files cached immutably', cache || 'no build file found');
} catch (error) {
  line(false, 'build files cached immutably', error.message);
}

console.log(failures ? `\n${failures} failed.` : '\nAll passed. Next: the signed-in checks in SHIP.md, in a private window.');
process.exit(failures ? 1 : 0);
