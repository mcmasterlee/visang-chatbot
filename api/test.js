// 진단용 엔드포인트 — /api/test
// Gemini API 키와 모델이 실제로 동작하는지 확인
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(200).json({ error: 'GEMINI_API_KEY 환경변수 없음', keySet: false });
  }

  const keyPreview = GEMINI_API_KEY.substring(0, 8) + '...' + GEMINI_API_KEY.slice(-4);
  const results = [];

  const MODELS = [
    { name: 'gemini-2.0-flash',      version: 'v1beta' },
    { name: 'gemini-2.0-flash-lite', version: 'v1beta' },
    { name: 'gemini-1.5-flash',      version: 'v1'     },
  ];

  const testBody = {
    contents: [{ role: 'user', parts: [{ text: '안녕' }] }],
    generationConfig: { maxOutputTokens: 10 }
  };

  for (const { name, version } of MODELS) {
    const url = `https://generativelanguage.googleapis.com/${version}/models/${name}:generateContent?key=${GEMINI_API_KEY}`;
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testBody),
        signal: AbortSignal.timeout(8000)
      });
      const data = await r.json();
      results.push({
        model: name,
        version,
        status: r.status,
        ok: r.ok,
        text: data?.candidates?.[0]?.content?.parts?.[0]?.text || null,
        error: data?.error?.message || null
      });
    } catch (e) {
      results.push({ model: name, version, status: 'fetch_error', error: e.message });
    }
  }

  return res.status(200).json({ keyPreview, keySet: true, results });
}
