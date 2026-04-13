// ═══════════════════════════════════════════
//  Vercel 서버리스 함수 — Gemini API 프록시
//  /api/chat 엔드포인트
// ═══════════════════════════════════════════

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS preflight 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Vercel 환경변수에서 API 키 읽기 (절대 클라이언트에 노출 안 됨)
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API 키가 서버에 설정되지 않았습니다.' });
  }

  const GEMINI_MODELS = [
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash'
  ];
  const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
  const RETRY_DELAYS_MS = [5000, 15000, 30000];
  const sleep = ms => new Promise(r => setTimeout(r, ms));

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

    // 모델 폴백 + 429 자동 재시도
    for (const model of GEMINI_MODELS) {
      const url = `${GEMINI_BASE}/${model}:generateContent?key=${GEMINI_API_KEY}`;

      for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
        try {
          if (attempt > 0) {
            const waitMs = RETRY_DELAYS_MS[attempt - 1];
            console.log(`[Gemini] ${model} 재시도 ${attempt}회 (${waitMs/1000}초 후)...`);
            await sleep(waitMs);
          } else {
            console.log(`[Gemini] 모델 시도: ${model}`);
          }

          const geminiRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });

          if (geminiRes.status === 429) {
            const errData = await geminiRes.json().catch(() => ({}));
            const msg = errData?.error?.message || '429 Too Many Requests';
            console.warn(`[Gemini] ${model} 429 (시도 ${attempt+1}): ${msg.substring(0, 80)}`);
            lastError = new Error(`429: ${msg}`);
            if (attempt < RETRY_DELAYS_MS.length) continue;
            break;
          }

          if (!geminiRes.ok) {
            const errData = await geminiRes.json().catch(() => ({}));
            const msg = errData?.error?.message || geminiRes.statusText;
            console.warn(`[Gemini] ${model} 실패 (${geminiRes.status}): ${msg.substring(0, 80)}`);
            lastError = new Error(`${model}: ${geminiRes.status} ${msg}`);
            break;
          }

          const data = await geminiRes.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!text) {
            console.warn(`[Gemini] ${model} 응답 텍스트 없음`);
            lastError = new Error(`${model}: 응답 텍스트 없음`);
            break;
          }

          console.log(`[Gemini] ${model} 성공 ✅`);
          return res.status(200).json({ text, model });

        } catch (fetchErr) {
          console.warn(`[Gemini] ${model} fetch 오류:`, fetchErr.message);
          lastError = fetchErr;
          break;
        }
      }
    }

    // 모든 모델 실패
    const is429 = lastError?.message?.includes('429');
    return res.status(is429 ? 429 : 500).json({
      error: lastError?.message || '모든 모델 시도 실패'
    });

  } catch (err) {
    console.error('[chat.js] 서버 오류:', err);
    return res.status(500).json({ error: err.message });
  }
}
