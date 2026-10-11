#!/usr/bin/env node
/**
 * Ping IndexNow (Bing, Yandex, Seznam, Naver — Google reads the signal) with
 * the site's indexable pages after a deploy.
 *
 * Key file: the site hosts its own IndexNow key at public/<KEY>.txt (served at
 * the apex root by the site Worker — the Tyashin edge only intercepts
 * /indexnow/<key>.txt, which needs the admin-minted key we can't read here).
 * IndexNow keys are public by design; this one proves nothing but ownership of
 * the host serving the file.
 *
 * Usage:
 *   node scripts/indexnow-ping.mjs                 # all sitemap-pages URLs
 *   node scripts/indexnow-ping.mjs /faq /collection # specific paths
 */
const ORIGIN = 'https://woodlarkveneer.com';
const KEY = '8b7050c0a02d6fa5704e8dfd5e96e513';
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

async function sitemapPaths() {
  const res = await fetch(`${ORIGIN}/sitemap-pages.xml`, { headers: { 'cache-control': 'no-cache' } });
  if (!res.ok) throw new Error(`sitemap-pages.xml ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

async function main() {
  const args = process.argv.slice(2);
  const paths = args.length ? args : await sitemapPaths();
  const urlList = paths.map((p) => `${ORIGIN}${p.startsWith('/') ? p : `/${p}`}`);

  // Fail fast if the key file isn't live yet (deploy still propagating).
  const keyRes = await fetch(KEY_LOCATION, { headers: { 'cache-control': 'no-cache' } });
  const keyBody = (await keyRes.text()).trim();
  if (!keyRes.ok || keyBody !== KEY) {
    console.error(`Key file not live: ${KEY_LOCATION} → ${keyRes.status} "${keyBody.slice(0, 40)}"`);
    process.exit(2);
  }

  const payload = { host: new URL(ORIGIN).host, key: KEY, keyLocation: KEY_LOCATION, urlList };
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });
  // 200 OK, 202 Accepted (key validation pending) are both success per spec.
  console.log(`IndexNow ${res.status} ${res.statusText} for ${urlList.length} URLs`);
  for (const u of urlList) console.log(`  ${u}`);
  if (res.status >= 400) {
    console.error(await res.text());
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
