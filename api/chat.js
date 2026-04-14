// ═══════════════════════════════════════════
//  Vercel 서버리스 함수 — Gemini API 프록시
//  /api/chat 엔드포인트
// ═══════════════════════════════════════════

export const maxDuration = 60;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다.', code: 'MISSING_API_KEY' });
  }

  // ── 이 API 키로 실제 사용 가능한 모델 (ListModels로 확인된 목록) ──
  const GEMINI_MODELS = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
  ];
  const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

  try {
    const { contents, generationConfig } = req.body;
    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({ error: '잘못된 요청 형식입니다.' });
    }

    const body = {
      contents,
      generationConfig: generationConfig || {
        temperature: 0.4,
        maxOutputTokens: 3000,
        topP: 0.85
      }
    };

    let lastError = null;

    for (const model of GEMINI_MODELS) {
      const url = `${GEMINI_BASE}/${model}:generateContent?key=${GEMINI_API_KEY}`;
      console.log(`[Gemini] 시도: ${model}`);

      try {
        const geminiRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(25000)
        });

        const data = await geminiRes.json();

        if (geminiRes.status === 429) {
          console.warn(`[Gemini] ${model} → 429, 다음 모델로`);
          lastError = new Error('429: ' + (data?.error?.message || 'Too Many Requests'));
          continue;
        }

        if (!geminiRes.ok) {
          console.warn(`[Gemini] ${model} → ${geminiRes.status}: ${data?.error?.message}`);
          lastError = new Error(`${model}: ${geminiRes.status} - ${data?.error?.message}`);
          continue;
        }

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          console.warn(`[Gemini] ${model} → 응답 텍스트 없음`);
          lastError = new Error(`${model}: 응답 텍스트 없음`);
          continue;
        }

        console.log(`[Gemini] ${model} → 성공 ✅`);
        return res.status(200).json({ text, model });

      } catch (fetchErr) {
        const isTimeout = fetchErr.name === 'AbortError' || fetchErr.name === 'TimeoutError';
        console.warn(`[Gemini] ${model} → ${isTimeout ? '타임아웃' : 'fetch 오류'}: ${fetchErr.message}`);
        lastError = new Error(`${model}: ${isTimeout ? '타임아웃' : fetchErr.message}`);
        continue;
      }
    }

    // 모든 모델 실패
    const errMsg = lastError?.message || '모든 모델 실패';
    const is429 = errMsg.includes('429');
    console.error(`[chat.js] 최종 실패: ${errMsg}`);

    return res.status(is429 ? 429 : 500).json({
      error: is429 ? '잠시 후 다시 시도해 주세요.' : errMsg,
      code: is429 ? 'RATE_LIMIT' : 'API_ERROR',
      detail: errMsg
    });

  } catch (err) {
    console.error('[chat.js] 서버 오류:', err.message);
    return res.status(500).json({ error: err.message, code: 'SERVER_ERROR' });
  }
}
