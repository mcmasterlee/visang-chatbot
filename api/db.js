// ═══════════════════════════════════════════
//  Vercel 서버리스 함수 — DB 범용 프록시
//  GET/POST/PUT/PATCH/DELETE 모두 지원
//  GENSPARK_COOKIE 환경변수로 인증 처리
// ═══════════════════════════════════════════

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const GENSPARK_BASE = 'https://www.genspark.ai/api/code_sandbox_light/preview/0b8c60ae-258c-4dee-a4a9-c03cd18e338b';
  const GENSPARK_COOKIE = process.env.GENSPARK_COOKIE || '';

  // /api/db 이후 경로 추출
  // 예: /api/db/tables/textbooks?limit=500 → /tables/textbooks?limit=500
  const rawUrl   = req.url || '';
  const pathPart = rawUrl.replace(/^\/api\/db/, '');
  const upstreamUrl = `${GENSPARK_BASE}${pathPart}`;

  console.log(`[db.js] ${req.method} ${upstreamUrl}`);

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(GENSPARK_COOKIE ? { 'Cookie': GENSPARK_COOKIE } : {})
      },
      signal: AbortSignal.timeout(15000)
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const upstream = await fetch(upstreamUrl, fetchOptions);

    // DELETE → 204 No Content
    if (req.method === 'DELETE') {
      if (upstream.ok) return res.status(204).end();
      const err = await upstream.json().catch(() => ({}));
      return res.status(upstream.status).json({ error: err?.error || '삭제 실패' });
    }

    const data = await upstream.json().catch(() => ({}));

    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    }

    return res.status(upstream.status).json(data);

  } catch (err) {
    console.error('[db.js] 오류:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
