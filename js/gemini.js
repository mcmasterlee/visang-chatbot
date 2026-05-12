// ===== Google Gemini API 통합 =====

const GeminiAPI = {
    API_KEY: 'AIzaSyAx8CLvIptlC3E4lFhmtJY7jG3enEizdoE',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',

    // Gemini로 답변 생성
    async generateAnswer(question, context) {
        try {
            const prompt = this.buildPrompt(question, context);
            
            const response = await fetch(`${this.endpoint}?key=${this.API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;
            
            return {
                answer: text,
                source: 'gemini',
                confidence: 90
            };

        } catch (error) {
            console.error('Gemini API 오류:', error);
            return null;
        }
    },

    // 프롬프트 구성
    buildPrompt(question, context) {
        const { faqs, textbooks, channel } = context;

        let prompt = `당신은 비상교육의 CS 담당자입니다. 선생님들의 문의에 친절하고 정확하게 답변해주세요.

## 역할
- 비바샘, 비상교재 학원선생님, 스콘 관련 문의에 답변
- 공손하고 전문적인 어조 유지
- 정확한 정보만 제공 (추측 금지)

## 중요 규칙
1. **채널 구분 명확히**: 비바샘/비상교재/스콘을 섞지 말 것
2. **링크 제공**: 관련 링크를 항상 포함
3. **존댓말 사용**: "안녕하세요, 선생님" / "감사합니다" 포함
4. **불확실하면**: "추가 확인이 필요합니다" 라고 안내

## 공식 링크
- 비바샘: https://www.vivasam.com
- 비바샘 e-Book 신청: https://v.vivasam.com/library/ebookApply.do
- 비상교재 학원선생님: https://book.visang.com/resources
- 스콘 북카페: https://sconn.io/
- 스콘 고객센터: https://pf.kakao.com/_nYdwxj

## 주요 FAQ
${faqs.slice(0, 10).map(faq => `
Q: ${faq.question}
A: ${faq.answer.substring(0, 200)}...
`).join('\n')}

## 교재 정보 (샘플)
${textbooks.slice(0, 10).map(t => `- ${t.brand} ${t.level}: ${t.status}`).join('\n')}

## 선생님의 질문
"${question}"

## 답변 형식
안녕하세요, 선생님.

[답변 내용]

[관련 링크]

감사합니다.

답변:`;

        return prompt;
    }
};
