// ═══════════════════════════════════════════
//  Vercel 서버리스 함수 — DB 프록시
//  /api/db?table=textbooks  또는  /api/db?table=links
//  Genspark DB → Vercel → 브라우저 (CORS 우회)
// ═══════════════════════════════════════════

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  const table  = req.query.table;
  const limit  = req.query.limit || 500;

  if (!table) return res.status(400).json({ error: 'table 파라미터가 필요합니다.' });

  const GENSPARK_BASE = 'https://www.genspark.ai/api/code_sandbox_light/preview/0b8c60ae-258c-4dee-a4a9-c03cd18e338b';

  try {
    const upstream = await fetch(`${GENSPARK_BASE}/tables/${table}?limit=${limit}`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!upstream.ok) {
      console.warn(`[db.js] upstream 오류 (${upstream.status}):`, table);
      return res.status(upstream.status).json({ error: `DB 오류: ${upstream.status}`, data: [] });
    }

    const data = await upstream.json();
    // 캐시: 5분
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    return res.status(200).json(data);

  } catch (err) {
    console.error('[db.js] fetch 오류:', err.message);
    return res.status(500).json({ error: err.message, data: [] });
  }
}
