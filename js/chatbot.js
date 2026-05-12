// ===== AI 챗봇 답변 생성 엔진 =====

const Chatbot = {
    // 스콘 기술 관련 키워드
    sconnTechKeywords: [
        '로그인', '인증', '본인인증', '인증번호', '페이지오류', '오류',
        '네트워크', '접속', '웹뷰어', '뷰어', '속도', '느림', '화질',
        '기기등록', '동시접속', '2대', '태블릿', '교강사인증', '인증메시지'
    ],

    // 공식 링크
    links: {
        vivasam: 'https://www.vivasam.com',
        vivasamEbook: 'https://v.vivasam.com/library/ebookApply.do?schoolCode=E&eduYear=2022',
        book: 'https://book.visang.com/resources',
        sconn: 'https://sconn.io/',
        sconnSupport: 'https://pf.kakao.com/_nYdwxj'
    },

    // 메인 답변 생성 함수
    async generateAnswer(inquiry) {
        const { question } = inquiry;
        
        // 채널 자동 감지
        const detectedChannel = this.detectChannel(question);
        
        // 1단계: FAQ 키워드 매칭
        const faqResult = await this.matchFAQ(question, detectedChannel);
        if (faqResult && faqResult.confidence >= 70) {
            return {
                answer: this.formatAnswer(faqResult.answer, detectedChannel),
                matched_faq_id: faqResult.id,
                confidence: faqResult.confidence,
                source: 'faq',
                channel: detectedChannel
            };
        }

        // 2단계: 교재 정보 조회 (교재명이 질문에 포함된 경우)
        const textbookInfo = await this.extractAndSearchTextbook(question);
        if (textbookInfo) {
            return {
                answer: this.formatTextbookAnswer(textbookInfo, detectedChannel),
                matched_faq_id: null,
                confidence: 75,
                source: 'textbook',
                channel: detectedChannel
            };
        }

        // 3단계: 스콘 기술 문의 감지
        if (this.isSconnTechIssue(question)) {
            return {
                answer: this.getSconnTechAnswer(),
                matched_faq_id: null,
                confidence: 70,
                source: 'sconn_tech',
                channel: 'sconn'
            };
        }

        // 4단계: Gemini AI 답변 생성 (NEW!)
        try {
            // GeminiAPI가 로드되었는지 확인
            if (typeof GeminiAPI !== 'undefined') {
                const faqs = await API.list('faqs', { limit: 100 }).catch(() => ({ data: [] }));
                const textbooks = await API.list('textbooks', { limit: 100 }).catch(() => ({ data: [] }));
                
                const geminiResult = await GeminiAPI.generateAnswer(question, {
                    faqs: faqs.data || [],
                    textbooks: textbooks.data || [],
                    channel: detectedChannel
                });

                if (geminiResult) {
                    return {
                        answer: geminiResult.answer,
                        matched_faq_id: null,
                        confidence: geminiResult.confidence,
                        source: 'gemini',
                        channel: detectedChannel
                    };
                }
            }
        } catch (error) {
            console.error('Gemini API 오류:', error);
        }

        // 5단계: 기본 답변 (Gemini 실패 시)
        return {
            answer: this.getDefaultAnswer(detectedChannel),
            matched_faq_id: null,
            confidence: 50,
            source: 'default',
            channel: detectedChannel
        };
    },

    // 채널 자동 감지
    detectChannel(question) {
        const questionLower = question.toLowerCase();
        
        // 스콘 관련 키워드
        const sconnKeywords = ['스콘', 'sconn', '북카페', '포티처', 'for teacher'];
        if (sconnKeywords.some(kw => questionLower.includes(kw))) {
            return 'sconn';
        }
        
        // 비바샘 관련 키워드
        const vivasamKeywords = ['비바샘', 'vivasam', 'ebook', 'e-book', '이북'];
        if (vivasamKeywords.some(kw => questionLower.includes(kw))) {
            return 'vivasam';
        }
        
        // 비상교재 학원선생님 관련 키워드
        const bookKeywords = ['학원', '비상교재', '교사용', 'pdf'];
        if (bookKeywords.some(kw => questionLower.includes(kw))) {
            return 'book';
        }
        
        // 기본값
        return 'general';
    },

    // 교재명 추출 및 검색
    async extractAndSearchTextbook(question) {
        try {
            const response = await API.list('textbooks', { limit: 1000 });
            if (!response || !response.data) {
                console.warn('교재 데이터 없음');
                return null;
            }
            
            const textbooks = response.data;

            // 교재명 패턴 찾기
            for (const book of textbooks) {
                const patterns = [
                    `${book.brand} ${book.level}`,
                    `${book.brand}`,
                    book.level
                ];
                
                for (const pattern of patterns) {
                    if (question.includes(pattern)) {
                        return book;
                    }
                }
            }

            return null;
        } catch (error) {
            console.error('교재 검색 오류:', error);
            return null;
        }
    },

    // FAQ 매칭
    async matchFAQ(question, channel) {
        try {
            const response = await API.list('faqs', { limit: 100 });
            if (!response || !response.data) {
                console.warn('FAQ 데이터 없음');
                return null;
            }
            
            const faqs = response.data.filter(faq => faq.active);

            let bestMatch = null;
            let maxScore = 0;

            for (const faq of faqs) {
                const score = this.calculateMatchScore(question, faq);
                if (score > maxScore) {
                    maxScore = score;
                    bestMatch = { ...faq, confidence: score };
                }
            }

            return bestMatch;
        } catch (error) {
            console.error('FAQ 매칭 오류:', error);
            return null;
        }
    },

    // 키워드 매칭 점수 계산
    calculateMatchScore(question, faq) {
        const questionLower = question.toLowerCase();
        let score = 0;

        // 키워드 매칭
        if (faq.keywords && Array.isArray(faq.keywords)) {
            for (const keyword of faq.keywords) {
                if (questionLower.includes(keyword.toLowerCase())) {
                    score += 15;
                }
            }
        }

        // 질문 유사도
        const faqQuestionLower = faq.question.toLowerCase();
        const questionWords = questionLower.split(/\s+/);
        const faqWords = faqQuestionLower.split(/\s+/);
        const commonWords = questionWords.filter(w => faqWords.includes(w));
        score += commonWords.length * 5;

        // 우선순위 가중치
        score += (faq.priority || 50) * 0.3;

        return Math.min(score, 100);
    },

    // 교재 검색
    async searchTextbook(textbookName) {
        try {
            const response = await API.list('textbooks', { limit: 100 });
            const textbooks = response.data;

            // 정확한 매칭 찾기
            for (const book of textbooks) {
                const bookTitle = `${book.brand} ${book.level}`.toLowerCase();
                if (bookTitle.includes(textbookName.toLowerCase()) ||
                    textbookName.toLowerCase().includes(book.brand.toLowerCase())) {
                    return book;
                }
            }

            return null;
        } catch (error) {
            console.error('교재 검색 오류:', error);
            return null;
        }
    },

    // 스콘 기술 문의 여부 판단
    isSconnTechIssue(question) {
        const questionLower = question.toLowerCase();
        return this.sconnTechKeywords.some(keyword => 
            questionLower.includes(keyword)
        );
    },

    // 답변 포맷팅
    formatAnswer(answer, channel) {
        let formatted = answer;

        // 링크 자동 변환
        formatted = formatted.replace(/https?:\/\/[^\s<]+/g, match => {
            return `<a href="${match}" target="_blank">${match}</a>`;
        });

        // 채널별 추가 정보 (중복 방지 - 답변에 이미 링크가 없을 때만)
        if (channel === 'vivasam' && !formatted.includes(this.links.vivasam)) {
            formatted += `\n\n📌 <strong>비바샘 사이트:</strong> <a href="${this.links.vivasam}" target="_blank">${this.links.vivasam}</a>`;
        } else if (channel === 'book' && !formatted.includes(this.links.book)) {
            formatted += `\n\n📌 <strong>비상교재 학원선생님:</strong> <a href="${this.links.book}" target="_blank">${this.links.book}</a>`;
        } else if (channel === 'sconn' && !formatted.includes(this.links.sconn)) {
            formatted += `\n\n📌 <strong>스콘 북카페:</strong> <a href="${this.links.sconn}" target="_blank">${this.links.sconn}</a>`;
        }

        return formatted;
    },

    // 교재 정보 답변
    formatTextbookAnswer(textbook, channel) {
        const statusText = textbook.status === '완료' ? 
            '✅ 현재 교사용 교재 본문 PDF가 <strong>등록 완료</strong>된 것으로 확인됩니다.' :
            '❌ 현재 교사용 교재 본문 PDF가 <strong>등록 완료 상태로 확인되지 않습니다</strong>.';

        let answer = `안녕하세요, 선생님.\n\n`;
        answer += `<strong>${textbook.brand} ${textbook.level}</strong> 교재에 대해 안내드립니다.\n\n`;
        answer += `${statusText}\n\n`;
        answer += `📚 <strong>상세 정보:</strong>\n`;
        answer += `- 과목: ${textbook.subject}\n`;
        answer += `- 자료실 구분: ${textbook.category}\n`;
        answer += `- 브랜드: ${textbook.brand}\n`;
        answer += `- 구분: ${textbook.level}\n`;
        
        if (textbook.note) {
            answer += `\n⚠️ <strong>비고:</strong> ${textbook.note}\n`;
        }

        answer += `\n📌 비상교육의 전체 교재가 모두 등록된 것은 아니며, 저작권 이슈 등으로 제공되지 않는 교재도 있을 수 있습니다.\n`;
        answer += `\n<strong>비상교재 학원선생님 사이트:</strong> <a href="${this.links.book}" target="_blank">${this.links.book}</a>`;

        return answer;
    },

    // 스콘 기술 문의 답변
    getSconnTechAnswer() {
        return `안녕하세요, 선생님.

스콘 이용 중 불편을 겪으셨다니 진심으로 죄송합니다.

문의 주신 내용은 스콘 북카페 서비스 내에서 발생한 기술적 사항으로,
정확한 원인 파악과 빠른 해결을 위해 스콘 고객센터를 통해 문의해 주시는 것이 가장 신속한 방법입니다.

<strong>스콘 북카페 고객센터:</strong> <a href="${this.links.sconnSupport}" target="_blank">${this.links.sconnSupport}</a>

<strong>상담시간(영업일):</strong> 월~금 오전 10시 ~ 오후 6시
<strong>점심시간:</strong> 오전 11시 30분 ~ 오후 1시 30분
※ 주말 및 공휴일은 상담이 어려운 점 참고 부탁드립니다.

번거로우시겠지만, 동일 증상이 지속되거나 추가 확인이 필요하신 경우 고객센터를 통해 문의해 주시면 보다 신속하고 정확한 안내를 받으실 수 있습니다.

감사합니다.`;
    },

    // 기본 답변
    getDefaultAnswer(channel) {
        let answer = `안녕하세요, 선생님.\n\n`;
        answer += `문의해 주신 내용에 대해 정확한 답변을 드리기 위해 추가 확인이 필요한 상황입니다.\n\n`;

        if (channel === 'vivasam') {
            answer += `<strong>비바샘 관련 문의</strong>는 아래 링크를 통해 자료 요청 및 문의를 진행해 주시기 바랍니다.\n\n`;
            answer += `📌 <strong>비바샘 e-Book 신청:</strong> <a href="${this.links.vivasamEbook}" target="_blank">${this.links.vivasamEbook}</a>\n`;
            answer += `📌 <strong>비바샘 사이트:</strong> <a href="${this.links.vivasam}" target="_blank">${this.links.vivasam}</a>\n`;
        } else if (channel === 'book') {
            answer += `<strong>비상교재 학원선생님 사이트 관련 문의</strong>는 아래 링크를 참고해 주세요.\n\n`;
            answer += `📌 <strong>비상교재 학원선생님:</strong> <a href="${this.links.book}" target="_blank">${this.links.book}</a>\n`;
        } else if (channel === 'sconn') {
            answer += `<strong>스콘 관련 문의</strong>는 아래 고객센터를 통해 문의 부탁드립니다.\n\n`;
            answer += `📌 <strong>스콘 북카페:</strong> <a href="${this.links.sconn}" target="_blank">${this.links.sconn}</a>\n`;
            answer += `📌 <strong>스콘 고객센터:</strong> <a href="${this.links.sconnSupport}" target="_blank">${this.links.sconnSupport}</a>\n`;
        } else {
            answer += `문의 내용에 따라 아래 링크를 참고해 주세요.\n\n`;
            answer += `📌 <strong>비바샘:</strong> <a href="${this.links.vivasam}" target="_blank">${this.links.vivasam}</a>\n`;
            answer += `📌 <strong>비상교재 학원선생님:</strong> <a href="${this.links.book}" target="_blank">${this.links.book}</a>\n`;
            answer += `📌 <strong>스콘 북카페:</strong> <a href="${this.links.sconn}" target="_blank">${this.links.sconn}</a>\n`;
            answer += `📌 <strong>스콘 고객센터:</strong> <a href="${this.links.sconnSupport}" target="_blank">${this.links.sconnSupport}</a>\n`;
        }

        answer += `\n감사합니다.`;

        return answer;
    }
