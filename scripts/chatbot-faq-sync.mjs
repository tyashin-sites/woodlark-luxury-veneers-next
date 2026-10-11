#!/usr/bin/env node
/**
 * Push the live /faq Q&As into the Woodlark chatbot ("Lark") knowledge base.
 *
 * Source of truth is the FAQPage JSON-LD on https://woodlarkveneer.com/faq —
 * the same block the site renders — so the page and the bot never disagree.
 *
 * Needs a Tyashin admin JWT (15-minute SUPER_ADMIN or project-admin token from
 * admin.tyashin.com DevTools → any API request → Authorization header). Pass it
 * via env; never commit it.
 *
 *   TYASHIN_JWT=eyJ... node scripts/chatbot-faq-sync.mjs           # add + embed
 *   TYASHIN_JWT=eyJ... node scripts/chatbot-faq-sync.mjs --dry-run # show diff only
 *
 * What it does:
 *   1. GET  knowledge            → existing FAQ sources (dedupe by question text)
 *   2. POST knowledge/faqs       → only the questions not already present
 *   3. POST knowledge/sitemap    → ensure the /faq URL is a page source too
 *   4. POST knowledge/process    → embed everything pending (costs OpenAI credits)
 *
 * The nightly kb-url-sync cron also picks up /faq from the sitemap on its own,
 * so step 3 is belt-and-braces; steps 1–2 are what put the verbatim answers in.
 */
const ORIGIN = 'https://woodlarkveneer.com';
const API = process.env.TYASHIN_API_URL || 'https://website-api.tyashin.com';
const PROJECT_ID = process.env.PROJECT_ID || '6a1c9aa66933b758bf066427';
const JWT = process.env.TYASHIN_JWT;
const DRY = process.argv.includes('--dry-run');

if (!JWT) {
  console.error('Set TYASHIN_JWT (admin token). Nothing sent.');
  process.exit(2);
}

const base = `${API}/api/v1/projects/${PROJECT_ID}/chatbot`;
const headers = { authorization: `Bearer ${JWT}`, 'content-type': 'application/json' };

async function api(path, init = {}) {
  const res = await fetch(`${base}${path}`, { ...init, headers: { ...headers, ...(init.headers || {}) } });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  if (!res.ok) throw new Error(`${init.method || 'GET'} ${path} → ${res.status} ${text.slice(0, 300)}`);
  return json;
}

async function liveFaqs() {
  const res = await fetch(`${ORIGIN}/faq`, { headers: { 'cache-control': 'no-cache' } });
  if (!res.ok) throw new Error(`/faq ${res.status}`);
  const html = await res.text();
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1]),
  );
  const nodes = blocks.flatMap((b) => (Array.isArray(b['@graph']) ? b['@graph'] : [b]));
  const faqPage = nodes.find((n) => n['@type'] === 'FAQPage');
  if (!faqPage) throw new Error('No FAQPage JSON-LD on /faq — is the deploy live?');
  return faqPage.mainEntity.map((q) => ({ question: q.name, answer: q.acceptedAnswer.text }));
}

const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();

async function main() {
  const faqs = await liveFaqs();
  console.log(`Live /faq has ${faqs.length} questions.`);

  const existing = await api('/knowledge');
  const sources = existing?.data?.sources || existing?.data || [];
  const have = new Set(
    (Array.isArray(sources) ? sources : [])
      .filter((s) => s.type === 'faq' && s.question)
      .map((s) => norm(s.question)),
  );
  const fresh = faqs.filter((f) => !have.has(norm(f.question)));
  console.log(`${have.size} FAQ sources already in the knowledge base; ${fresh.length} new.`);
  for (const f of fresh) console.log(`  + ${f.question}`);

  if (DRY) {
    console.log('Dry run — nothing sent.');
    return;
  }

  if (fresh.length) {
    const added = await api('/knowledge/faqs', { method: 'POST', body: JSON.stringify({ faqs: fresh }) });
    console.log(`Added ${added?.data?.count ?? fresh.length} FAQ sources.`);
  }

  const urlAdd = await api('/knowledge/sitemap', {
    method: 'POST',
    body: JSON.stringify({ urls: [`${ORIGIN}/faq`], max: 1 }),
  });
  console.log('Page source /faq:', urlAdd?.message || JSON.stringify(urlAdd?.data || {}).slice(0, 200));

  const processed = await api('/knowledge/process', { method: 'POST' });
  console.log(processed?.message || JSON.stringify(processed));
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
