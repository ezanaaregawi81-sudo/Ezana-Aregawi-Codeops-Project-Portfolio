// Checks a deployed Addis Eats the way a first-time visitor in a private window meets it: no
// cookies, nothing cached.
//
//   node scripts/verify-deploy.mjs https://your-app.vercel.app
//
// The signed-in part (sign in, order, live tracking, CSV) is a manual list in DEPLOY.md.
const site = (process.argv[2] ?? '').replace(/\/$/, '');
if (!/^https?:\/\//.test(site)) {
  console.error('Usage: node scripts/verify-deploy.mjs https://your-app.vercel.app');
  process.exit(1);
}

const isRedirectTo = (target) => (res) => res.status >= 300 && res.status < 400 && (res.headers.get('location') ?? '').includes(target);

// [what, path, request options, passes(response, body)]
const CHECKS = [
  ['served over HTTPS', '/', {}, () => site.startsWith('https://')],
  ['home page', '/', {}, (res, body) => res.status === 200 && body.includes('Addis')],
  ['menu', '/menu', {}, (res) => res.status === 200],
  ['a prerendered dish', '/menu/doro-wat', {}, (res, body) => res.status === 200 && body.includes('Doro Wat')],
  ['unknown dish → real 404', '/menu/no-such-dish', {}, (res) => res.status === 404],
  ['unknown page → real 404', '/no-such-page', {}, (res) => res.status === 404],
  ['/orders → sign-in', '/orders', {}, isRedirectTo('/sign-in')],
  ['/checkout → sign-in', '/checkout', {}, isRedirectTo('/sign-in')],
  ['/kitchen → sign-in', '/kitchen', {}, isRedirectTo('/sign-in')],
  ['nobody signed in', '/api/session', {}, (res, body) => res.status === 200 && /"user":null/.test(body)],
  ['order API refuses a stranger', '/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }, (res) => res.status === 401],
  ['live feed refuses a stranger', '/api/orders/AE-0/events', {}, (res) => res.status === 401],
  ['CSV download refuses a stranger', '/kitchen/reports/export.csv', {}, (res) => res.status === 401],
  ['sign-in page', '/sign-in', {}, (res) => res.status === 200],
];

let failures = 0;
console.log(`Verifying ${site}\n`);
for (const [what, path, init, passes] of CHECKS) {
  try {
    const res = await fetch(site + path, { redirect: 'manual', ...init });
    const body = res.status >= 300 && res.status < 400 ? '' : await res.text();
    const ok = passes(res, body);
    if (!ok) failures++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${what.padEnd(32)} ${res.status} ${path}`);
  } catch (error) {
    failures++;
    console.log(`FAIL  ${what.padEnd(32)} ${error.message}`);
  }
}

// Hashed build files: cached for a year by the CDN.
const home = await fetch(site + '/').then((res) => res.text()).catch(() => '');
const file = home.match(/\/_next\/static\/[^"']+\.js/)?.[0];
if (file) {
  const cache = (await fetch(site + file)).headers.get('cache-control') ?? '';
  const ok = cache.includes('immutable');
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${'build files cached immutably'.padEnd(32)} ${cache}`);
}

console.log(failures ? `\n${failures} failed.` : '\nAll passed. Next: the signed-in checks in DEPLOY.md, in a private window.');
process.exit(failures ? 1 : 0);
