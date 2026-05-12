비상교육 교강사 지원 챗봇
개요
학교 교사(비바샘), 학원 강사(비상교재), e-Book 이용자(스콘) 대상  
Gemini AI 기반 실시간 CS 응답 챗봇.
핵심 기능
🤖 Gemini 2.0 Flash 실시간 AI 답변
📎 이미지 첨부 및 분석 (오류 화면 등)
💬 멀티턴 대화 (맥락 유지)
🎯 서비스 자동 구분 (비바샘 / 비상교재 / 스콘)
📱 모바일 반응형 디자인
파일 구조
```
index.html   ← 단일 파일 (모든 기능 포함)
README.md
```
배포 방법
Netlify Drop (가장 빠름, 로그인 불필요)
https://app.netlify.com/drop 접속
`index.html` 파일 드래그 앤 드롭
즉시 URL 생성 (예: https://xxx.netlify.app)
Vercel
https://vercel.com 가입 (GitHub 계정)
New Project → 파일 업로드 → Deploy
GitHub Pages
GitHub 저장소 생성
index.html 업로드
Settings → Pages → main 브랜치 활성화
API 정보
Gemini 2.0 Flash (Google AI Studio)
모델: `gemini-2.0-flash`
이미지 분석 지원
멀티턴 대화 지원
서비스 범위
서비스	대상	주요 문의
비바샘	학교 교사	PDF 자료, e-Book 신청, 교사 인증
비상교재	학원 강사	PDF 자료, 강사 인증, 이메일 발송
스콘	e-Book 이용자	로그인, 기기 등록, 웹 뷰어
고객센터 링크
비바샘: https://www.vivasam.com
비상교재: https://book.visang.com
스콘: https://sconn.io
스콘 카카오: https://pf.kakao.com/_nYdwxj
