// ===== 관리자 기능 =====

const Admin = {
    currentInquiryId: null,

    // 통계 업데이트
    async updateStats() {
        try {
            const [inquiries, faqs, textbooks, ebooks] = await Promise.all([
                API.list('inquiries', { limit: 1000 }),
                API.list('faqs', { limit: 100 }),
                API.list('textbooks', { limit: 1000 }),
                API.list('sconn_ebooks', { limit: 1000 })
            ]);

            document.getElementById('totalInquiries').textContent = inquiries.total || 0;
            document.getElementById('totalFaqs').textContent = faqs.total || 0;
            document.getElementById('totalTextbooks').textContent = textbooks.total || 0;
            document.getElementById('totalEbooks').textContent = ebooks.total || 0;
        } catch (error) {
            console.error('통계 업데이트 오류:', error);
        }
    },

    // FAQ 목록 로드
    async loadFAQs() {
        try {
            const response = await API.list('faqs', { limit: 100, sort: '-priority' });
            const faqs = response.data || [];

            const container = document.getElementById('faqList');
            container.innerHTML = '';

            if (faqs.length === 0) {
                container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:40px;">등록된 FAQ가 없습니다.</p>';
                return;
            }

            faqs.forEach(faq => {
                const item = document.createElement('div');
                item.className = 'data-item';
                item.innerHTML = `
                    <h4>${faq.question}</h4>
                    <p><strong>카테고리:</strong> ${faq.category || '-'} | <strong>채널:</strong> ${faq.channel || 'all'} | <strong>우선순위:</strong> ${faq.priority || 50}</p>
                    <p><strong>답변:</strong> ${faq.answer.substring(0, 100)}...</p>
                    <div class="tags">
                        ${(faq.keywords || []).map(k => `<span class="tag">${k}</span>`).join('')}
                    </div>
                    <div class="data-item-actions">
                        <button class="btn-edit" onclick="Admin.editFAQ('${faq.id}')">✏️ 수정</button>
                        <button class="btn-delete" onclick="Admin.deleteFAQ('${faq.id}', '${faq.question.replace(/'/g, "\\'")}')">🗑️ 삭제</button>
                    </div>
                `;
                container.appendChild(item);
            });
        } catch (error) {
            console.error('FAQ 로드 오류:', error);
        }
    },

    // FAQ 추가 모달 열기
    openAddFAQModal() {
        document.getElementById('faqModalTitle').textContent = 'FAQ 추가';
        document.getElementById('faqForm').reset();
        document.getElementById('faqId').value = '';
        document.getElementById('faqActive').checked = true;
        document.getElementById('faqModal').style.display = 'flex';
    },

    // FAQ 수정 모달 열기
    async editFAQ(faqId) {
        try {
            const faq = await API.get('faqs', faqId);
            
            document.getElementById('faqModalTitle').textContent = 'FAQ 수정';
            document.getElementById('faqId').value = faq.id;
            document.getElementById('faqCategory').value = faq.category || '스콘기술';
            document.getElementById('faqQuestion').value = faq.question;
            document.getElementById('faqAnswer').value = faq.answer;
            document.getElementById('faqKeywords').value = (faq.keywords || []).join(', ');
            document.getElementById('faqPriority').value = faq.priority || 50;
            document.getElementById('faqChannel').value = faq.channel || 'all';
            document.getElementById('faqLinks').value = (faq.links || []).join(', ');
            document.getElementById('faqActive').checked = faq.active !== false;
            
            document.getElementById('faqModal').style.display = 'flex';
        } catch (error) {
            console.error('FAQ 로드 오류:', error);
            alert('FAQ를 불러오는 중 오류가 발생했습니다.');
        }
    },

    // FAQ 삭제
    async deleteFAQ(faqId, question) {
        if (!confirm(`정말 삭제하시겠습니까?\n\n"${question}"`)) {
            return;
        }

        try {
            await API.delete('faqs', faqId);
            alert('FAQ가 삭제되었습니다.');
            this.loadFAQs();
            this.updateStats();
        } catch (error) {
            console.error('FAQ 삭제 오류:', error);
            alert('FAQ 삭제 중 오류가 발생했습니다.');
        }
    },

    // FAQ 폼 제출
    async submitFAQ(formData) {
        try {
            const faqId = formData.get('faqId');
            const data = {
                category: formData.get('category'),
                question: formData.get('question'),
                answer: formData.get('answer'),
                keywords: formData.get('keywords').split(',').map(k => k.trim()).filter(k => k),
                priority: parseInt(formData.get('priority')) || 50,
                channel: formData.get('channel'),
                links: formData.get('links').split(',').map(l => l.trim()).filter(l => l),
                active: formData.get('active') === 'on'
            };

            if (faqId) {
                // 수정
                await API.put('faqs', faqId, data);
                alert('FAQ가 수정되었습니다.');
            } else {
                // 추가
                await API.create('faqs', data);
                alert('FAQ가 추가되었습니다.');
            }

            this.closeFAQModal();
            this.loadFAQs();
            this.updateStats();
        } catch (error) {
            console.error('FAQ 저장 오류:', error);
            alert('FAQ 저장 중 오류가 발생했습니다.');
        }
    },

    // FAQ 모달 닫기
    closeFAQModal() {
        document.getElementById('faqModal').style.display = 'none';
    },

    // 교재 목록 로드
    async loadTextbooks(searchQuery = '') {
        try {
            const params = { limit: 1000 };
            if (searchQuery) params.search = searchQuery;

            const response = await API.list('textbooks', params);
            const textbooks = response.data || [];

            const container = document.getElementById('textbookList');
            container.innerHTML = '';

            if (textbooks.length === 0) {
                container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:40px;">검색 결과가 없습니다.</p>';
                return;
            }

            // 테이블 생성
            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.innerHTML = `
                <thead>
                    <tr style="background:var(--bg-tertiary);text-align:left;">
                        <th style="padding:12px;">과목</th>
                        <th style="padding:12px;">브랜드</th>
                        <th style="padding:12px;">구분</th>
                        <th style="padding:12px;">상태</th>
                        <th style="padding:12px;">비고</th>
                    </tr>
                </thead>
                <tbody>
                    ${textbooks.map(book => `
                        <tr style="border-bottom:1px solid var(--border);">
                            <td style="padding:12px;">${book.subject || '-'}</td>
                            <td style="padding:12px;">${book.brand || '-'}</td>
                            <td style="padding:12px;">${book.level || '-'}</td>
                            <td style="padding:12px;">
                                <span style="padding:4px 12px;border-radius:20px;font-size:0.85rem;
                                    background:${book.status === '완료' ? 'var(--success)' : 'var(--warning)'};
                                    color:white;">
                                    ${book.status || '-'}
                                </span>
                            </td>
                            <td style="padding:12px;font-size:0.9rem;color:var(--text-secondary);">
                                ${book.note || '-'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            container.appendChild(table);
        } catch (error) {
            console.error('교재 목록 로드 오류:', error);
        }
    },

    // 문의 로그 로드
    async loadInquiryLogs(channelFilter = 'all') {
        try {
            const params = { limit: 100, sort: '-created_at' };
            if (channelFilter !== 'all') params.search = channelFilter;

            const response = await API.list('inquiries', params);
            const inquiries = response.data || [];

            const container = document.getElementById('inquiryLogs');
            container.innerHTML = '';

            if (inquiries.length === 0) {
                container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);padding:40px;">문의 내역이 없습니다.</p>';
                return;
            }

            inquiries.forEach(inquiry => {
                const date = new Date(inquiry.created_at).toLocaleString('ko-KR');
                const item = document.createElement('div');
                item.className = 'data-item';
                
                const channelText = {
                    'vivasam': '비바샘',
                    'book': '비상교재 학원선생님',
                    'etc': '기타'
                }[inquiry.channel] || inquiry.channel;

                const feedbackIcon = {
                    'helpful': '👍',
                    'not_helpful': '👎',
                    'none': '⏹️'
                }[inquiry.feedback] || '⏹️';

                item.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px;">
                        <h4>${inquiry.textbook_name || '교재명 없음'}</h4>
                        <span style="font-size:0.85rem;color:var(--text-secondary);">${date}</span>
                    </div>
                    <p><strong>채널:</strong> ${channelText} | <strong>신뢰도:</strong> ${inquiry.confidence || 0}% | <strong>피드백:</strong> ${feedbackIcon}</p>
                    <p><strong>질문:</strong> ${inquiry.question.substring(0, 150)}...</p>
                    <p style="color:var(--text-secondary);font-size:0.9rem;"><strong>답변:</strong> ${inquiry.answer.substring(0, 100)}...</p>
                `;
                container.appendChild(item);
            });
        } catch (error) {
            console.error('문의 로그 로드 오류:', error);
        }
    },

    // 초기화
    init() {
        this.updateStats();
        this.loadFAQs();
        this.loadTextbooks();
        this.loadInquiryLogs();

        // 교재 검색
        const searchInput = document.getElementById('textbookSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.loadTextbooks(e.target.value);
            });
        }

        // 채널 필터
        const channelFilter = document.getElementById('channelFilter');
        if (channelFilter) {
            channelFilter.addEventListener('change', (e) => {
                this.loadInquiryLogs(e.target.value);
            });
        }

        // FAQ 추가 버튼
        const addFaqBtn = document.getElementById('addFaqBtn');
        if (addFaqBtn) {
            addFaqBtn.addEventListener('click', () => {
                this.openAddFAQModal();
            });
        }

        // FAQ 모달 닫기 버튼들
        const closeFaqModal = document.getElementById('closeFaqModal');
        const cancelFaqBtn = document.getElementById('cancelFaqBtn');
        if (closeFaqModal) {
            closeFaqModal.addEventListener('click', () => this.closeFAQModal());
        }
        if (cancelFaqBtn) {
            cancelFaqBtn.addEventListener('click', () => this.closeFAQModal());
        }

        // FAQ 모달 배경 클릭 시 닫기
        const faqModal = document.getElementById('faqModal');
        if (faqModal) {
            faqModal.addEventListener('click', (e) => {
                if (e.target === faqModal) {
                    this.closeFAQModal();
                }
            });
        }

        // FAQ 폼 제출
        const faqForm = document.getElementById('faqForm');
        if (faqForm) {
            faqForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                await this.submitFAQ(formData);
            });
        }
    }
};
