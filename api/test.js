// 진단용 — 이 API 키로 사용 가능한 모델 목록 직접 조회
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(200).json({ error: 'GEMINI_API_KEY 없음' });
  }

  const keyPreview = GEMINI_API_KEY.substring(0, 8) + '...' + GEMINI_API_KEY.slice(-4);

  try {
    // 이 키로 사용 가능한 모든 모델 목록 조회
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`,
      { signal: AbortSignal.timeout(10000) }
    );
    const data = await r.json();

    if (!r.ok) {
      return res.status(200).json({ keyPreview, error: data?.error?.message });
    }

    // generateContent 가능한 모델만 필터링
    const models = (data.models || [])
      .filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
      .map(m => m.name.replace('models/', ''));

    return res.status(200).json({ keyPreview, availableModels: models });

  } catch (e) {
    return res.status(200).json({ keyPreview, error: e.message });
  }
}
