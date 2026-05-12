// ===== 메인 애플리케이션 로직 =====

class App {
    constructor() {
        this.currentInquiryId = null;
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupInquiryForm();
        this.setupAdminTabs();
        
        // 초기 로드
        if (document.getElementById('admin-tab').classList.contains('active')) {
            Admin.init();
        }
    }

    // 탭 전환
    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;

                // 모든 탭 비활성화
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // 선택한 탭 활성화
                btn.classList.add('active');
                document.getElementById(`${targetTab}-tab`).classList.add('active');

                // 관리자 탭 진입 시 데이터 로드
                if (targetTab === 'admin') {
                    Admin.init();
                }
            });
        });
    }

    // 관리자 서브탭
    setupAdminTabs() {
        const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
        const adminTabContents = document.querySelectorAll('.admin-tab-content');

        adminTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.adminTab;

                adminTabBtns.forEach(b => b.classList.remove('active'));
                adminTabContents.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                document.getElementById(`admin-${targetTab}`).classList.add('active');
            });
        });
    }

    // 문의 폼 설정
    setupInquiryForm() {
        const form = document.getElementById('inquiryForm');
        const newInquiryBtn = document.getElementById('newInquiryBtn');
        const copyAnswerBtn = document.getElementById('copyAnswerBtn');
        const feedbackBtns = document.querySelectorAll('.btn-feedback');

        // 폼 제출
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleInquirySubmit();
        });

        // 새 문의하기
        newInquiryBtn.addEventListener('click', () => {
            this.resetForm();
        });

        // 답변 복사
        copyAnswerBtn.addEventListener('click', () => {
            this.copyAnswer();
        });

        // 피드백
        feedbackBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                await this.handleFeedback(btn.dataset.feedback);
            });
        });
    }

    // 문의 제출 처리
    async handleInquirySubmit() {
        const formData = {
            question: document.getElementById('question').value.trim(),
            image_url: '',
            feedback: 'none'
        };

        // 유효성 검사
        if (!formData.question) {
            alert('문의 내용을 입력해주세요.');
            return;
        }

        // 이미지 업로드 처리 (간소화)
        const imageFile = document.getElementById('imageUpload').files[0];
        if (imageFile) {
            // 실제 구현에서는 이미지를 클라우드 스토리지에 업로드하고 URL을 받아야 함
            // 현재는 로컬 파일명만 저장
            formData.image_url = imageFile.name;
        }

        // 로딩 표시
        this.showLoading();

        try {
            // AI 답변 생성
            const result = await Chatbot.generateAnswer(formData);

            // 문의 데이터 저장 (선택사항 - API 실패해도 계속 진행)
            try {
                const inquiryData = {
                    channel: result.channel || 'general',
                    textbook_name: '',
                    ...formData,
                    answer: result.answer,
                    matched_faq_id: result.matched_faq_id,
                    confidence: result.confidence,
                    created_at: new Date().toISOString()
                };

                const savedInquiry = await API.create('inquiries', inquiryData);
                this.currentInquiryId = savedInquiry.id;
            } catch (saveError) {
                console.warn('문의 로그 저장 실패 (답변은 정상 표시):', saveError);
            }

            // 답변 표시
            this.showAnswer(result.answer);

        } catch (error) {
            console.error('문의 처리 오류:', error);
            
            // 기본 답변이라도 표시
            const fallbackAnswer = `안녕하세요, 선생님.\n\n현재 시스템에 일시적인 문제가 발생했습니다.\n\n문의 내용에 따라 아래 링크를 참고해 주세요:\n\n📌 비바샘: https://www.vivasam.com\n📌 비상교재 학원선생님: https://book.visang.com/resources\n📌 스콘 북카페: https://sconn.io/\n📌 스콘 고객센터: https://pf.kakao.com/_nYdwxj\n\n감사합니다.`;
            
            this.showAnswer(fallbackAnswer);
        } finally {
            this.hideLoading();
        }
    }

    // 로딩 표시
    showLoading() {
        document.getElementById('loadingIndicator').style.display = 'block';
        document.getElementById('answerContainer').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loadingIndicator').style.display = 'none';
    }

    // 답변 표시
    showAnswer(answer) {
        const answerContainer = document.getElementById('answerContainer');
        const answerContent = document.getElementById('answerContent');
        
        answerContent.innerHTML = answer;
        answerContainer.style.display = 'block';
        
        // 스크롤
        answerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // 답변 복사
    copyAnswer() {
        const answerContent = document.getElementById('answerContent');
        const text = answerContent.innerText;

        navigator.clipboard.writeText(text).then(() => {
            alert('답변이 클립보드에 복사되었습니다! ✅');
        }).catch(err => {
            console.error('복사 실패:', err);
            alert('복사에 실패했습니다.');
        });
    }

    // 피드백 처리
    async handleFeedback(feedbackType) {
        if (!this.currentInquiryId) {
            alert('문의 정보가 없습니다.');
            return;
        }

        try {
            await API.patch('inquiries', this.currentInquiryId, {
                feedback: feedbackType
            });

            const feedbackText = feedbackType === 'helpful' ? '👍 도움됨' : '👎 도움안됨';
            alert(`피드백이 등록되었습니다: ${feedbackText}`);

        } catch (error) {
            console.error('피드백 저장 오류:', error);
            alert('피드백 저장에 실패했습니다.');
        }
    }

    // 폼 초기화
    resetForm() {
        document.getElementById('inquiryForm').reset();
        document.getElementById('answerContainer').style.display = 'none';
        this.currentInquiryId = null;

        // 스크롤
        document.querySelector('.inquiry-form').scrollIntoView({ behavior: 'smooth' });
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
