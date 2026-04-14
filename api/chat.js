// ═══════════════════════════════════════════
//  Vercel 서버리스 함수 — Gemini API 프록시
//  /api/chat 엔드포인트
// ═══════════════════════════════════════════

export const maxDuration = 60; // Vercel Pro: 60초, Free: 최대 10초 (자동 조정)

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

  // ── 환경변수 체크 ──
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error('[chat.js] ❌ GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
    console.error('[chat.js] Vercel Dashboard → Settings → Environment Variables 에서 GEMINI_API_KEY 를 추가하세요.');
    return res.status(500).json({
      error: '서버 설정 오류: GEMINI_API_KEY가 Vercel 환경변수에 없습니다. Vercel Dashboard → Settings → Environment Variables에서 추가해 주세요.',
      code: 'MISSING_API_KEY'
    });
  }

  // ── 모델 & 타이밍 설정 ──
  // Vercel Free 플랜: 함수 실행 최대 10초
  // → 재시도 대기를 짧게 하고, 빠른 모델 우선 사용
  // 모델별 API 버전이 다름:
  // gemini-2.0-* → v1beta 필수
  // gemini-1.5-* → v1 사용
  const GEMINI_MODELS = [
    { name: 'gemini-2.0-flash',      version: 'v1beta' },
    { name: 'gemini-2.0-flash-lite', version: 'v1beta' },
    { name: 'gemini-1.5-flash',      version: 'v1'     },
    { name: 'gemini-1.5-flash-8b',   version: 'v1'     },
  ];
  const GEMINI_HOST = 'https://generativelanguage.googleapis.com';

  // Vercel Free: 10초 제한 → 재시도 없이 바로 다음 모델로 폴백
  // Vercel Pro: 60초 제한 → 짧은 재시도 허용
  const IS_PRO = process.env.VERCEL_PLAN === 'pro';
  const RETRY_WAIT_MS = IS_PRO ? 3000 : 0; // Free는 재시도 대기 없이 바로 다음 모델
  const MAX_RETRIES_PER_MODEL = IS_PRO ? 1 : 0; // Free는 재시도 없음

  const sleep = ms => ms > 0 ? new Promise(r => setTimeout(r, ms)) : Promise.resolve();

  try {
    const { contents, generationConfig } = req.body;

    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({ error: '잘못된 요청 형식입니다. contents 배열이 필요합니다.' });
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
    let lastStatus = null;

    // ── 모델 폴백 루프 ──
    for (const { name: model, version } of GEMINI_MODELS) {
      const url = `${GEMINI_HOST}/${version}/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      console.log(`[Gemini] 모델 시도: ${model} (${version})`);

      for (let attempt = 0; attempt <= MAX_RETRIES_PER_MODEL; attempt++) {
        if (attempt > 0 && RETRY_WAIT_MS > 0) {
          console.log(`[Gemini] ${model} 재시도 ${attempt}회 (${RETRY_WAIT_MS/1000}초 후)...`);
          await sleep(RETRY_WAIT_MS);
        }

        try {
          const controller = new AbortController();
          // Vercel Free: 8초 타임아웃 (10초 제한보다 여유 있게)
          const timeoutId = setTimeout(() => controller.abort(), IS_PRO ? 55000 : 8000);

          const geminiRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          lastStatus = geminiRes.status;

          if (geminiRes.status === 429) {
            const errData = await geminiRes.json().catch(() => ({}));
            const msg = errData?.error?.message || '429 Too Many Requests';
            console.warn(`[Gemini] ${model} 429 (시도 ${attempt+1}): ${msg.substring(0, 100)}`);
            lastError = new Error(`429: ${msg}`);
            // 429이면 재시도하지 않고 다음 모델로
            break;
          }

          if (geminiRes.status === 503 || geminiRes.status === 502) {
            const msg = `${model}: ${geminiRes.status} 서버 일시 불가`;
            console.warn(`[Gemini] ${msg}`);
            lastError = new Error(msg);
            break;
          }

          if (!geminiRes.ok) {
            const errData = await geminiRes.json().catch(() => ({}));
            const msg = errData?.error?.message || geminiRes.statusText;
            console.warn(`[Gemini] ${model} 실패 (${geminiRes.status}): ${msg.substring(0, 100)}`);
            lastError = new Error(`${model}: ${geminiRes.status} - ${msg}`);
            break;
          }

          const data = await geminiRes.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!text) {
            // 안전 필터에 의해 차단된 경우 체크
            const finishReason = data?.candidates?.[0]?.finishReason;
            const safetyMsg = finishReason === 'SAFETY' ? '안전 필터에 의해 응답이 차단되었습니다.' : '응답 텍스트 없음';
            console.warn(`[Gemini] ${model} 응답 텍스트 없음 (finishReason: ${finishReason})`);
            lastError = new Error(`${model}: ${safetyMsg}`);
            break;
          }

          console.log(`[Gemini] ${model} 성공 ✅`);
          return res.status(200).json({ text, model });

        } catch (fetchErr) {
          if (fetchErr.name === 'AbortError') {
            console.warn(`[Gemini] ${model} 타임아웃 (8초 초과)`);
            lastError = new Error(`${model}: 응답 시간 초과 (8초)`);
          } else {
            console.warn(`[Gemini] ${model} fetch 오류:`, fetchErr.message);
            lastError = fetchErr;
          }
          break;
        }
      }
    }

    // ── 모든 모델 실패 ──
    const errMsg = lastError?.message || '모든 모델 시도 실패';
    const is429 = errMsg.includes('429');
    const isTimeout = errMsg.includes('타임아웃') || errMsg.includes('시간 초과');

    console.error(`[chat.js] 최종 실패: ${errMsg}`);

    return res.status(is429 ? 429 : 500).json({
      error: is429
        ? '요청이 너무 많습니다 (429). 잠시 후 다시 시도해 주세요.'
        : isTimeout
          ? 'AI 응답 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.'
          : errMsg,
      code: is429 ? 'RATE_LIMIT' : isTimeout ? 'TIMEOUT' : 'API_ERROR',
      detail: errMsg
    });

  } catch (err) {
    console.error('[chat.js] 서버 오류:', err);
    return res.status(500).json({
      error: '서버 내부 오류: ' + err.message,
      code: 'SERVER_ERROR'
    });
  }
}
