// FAQ 50개 - 데이터베이스 등록용
// 이 파일을 브라우저 콘솔에서 실행하여 FAQ 일괄 등록

const newFAQs = [
    // ===== 비바샘 관련 (15개) =====
    {
        category: "자료제공",
        question: "비바샘에서 e-Book을 어떻게 신청하나요?",
        answer: "안녕하세요, 선생님.\n\n비바샘 e-Book 신청은 아래 링크를 통해 진행하실 수 있습니다.\n\n📌 비바샘 e-Book 신청: https://v.vivasam.com/library/ebookApply.do?schoolCode=E&eduYear=2022\n\n신청 후 자료 지급이 완료되면 스콘 포티처 앱을 통해 열람하실 수 있습니다.\n\n감사합니다.",
        keywords: ["비바샘", "ebook", "신청", "방법", "어떻게"],
        priority: 95,
        channel: "all",
        links: ["https://v.vivasam.com/library/ebookApply.do"],
        active: true
    },
    {
        category: "자료제공",
        question: "비바샘에서 e-Book 신청 후 언제 자료를 받을 수 있나요?",
        answer: "안녕하세요, 선생님.\n\n비바샘 e-Book 신청 후 자료 지급까지는 영업일 기준 1~3일 정도 소요될 수 있습니다.\n\n지급이 완료되면 스콘 포티처 앱에서 확인하실 수 있으며, 동시에 교강사 인증도 자동 처리됩니다.\n\n일정 기간 이상 자료를 받지 못하신 경우, 담당 지사로 문의 부탁드립니다.\n\n감사합니다.",
        keywords: ["비바샘", "신청", "언제", "자료", "지급", "기간"],
        priority: 85,
        channel: "all",
        links: [],
        active: true
    },
    {
        category: "자료제공",
        question: "비바샘 e-Book에는 어떤 자료가 포함되나요?",
        answer: "안녕하세요, 선생님.\n\n비바샘 e-Book에는 다음 자료가 모두 포함되어 제공됩니다:\n\n✅ 학생용 교재\n✅ 교사용 교재\n✅ 정답 및 해설\n✅ 선생님 특별자료\n\n모든 자료는 스콘 포티처 앱을 통해 열람하실 수 있습니다.\n\n감사합니다.",
        keywords: ["비바샘", "ebook", "포함", "자료", "무엇", "내용"],
        priority: 80,
        channel: "all",
        links: [],
        active: true
    },
    {
        category: "자료제공",
        question: "비바샘 자료를 PC에서도 볼 수 있나요?",
        answer: "안녕하세요, 선생님.\n\n비바샘 e-Book 자료는 PC와 모바일/태블릿 모두에서 열람 가능합니다.\n\nPC: 스콘 북카페 웹사이트 (https://sconn.io/)\n모바일/태블릿: 스콘 포티처 앱\n\n다만 PC 웹 뷰어의 경우 속도나 화질 면에서 앱 대비 다소 차이가 있을 수 있습니다.\n\n감사합니다.",
        keywords: ["비바샘", "PC", "웹", "컴퓨터", "볼수있나"],
        priority: 75,
        channel: "all",
        links: ["https://sconn.io/"],
        active: true
    },
    {
        category: "정책",
        question: "비바샘 e-Book은 몇 대의 기기에서 사용할 수 있나요?",
        answer: "안녕하세요, 선생님.\n\n스콘 포티처 앱의 기기 등록 및 동시 접속은 최대 2대까지 가능합니다.\n\n예: 수업용 태블릿 1대 + 교재 연구용 태블릿 1대\n\n감사합니다.",
        keywords: ["비바샘", "기기", "몇대", "2대", "동시"],
        priority: 88,
        channel: "all",
        links: [],
        active: true
    },
    {
        category: "자료제공",
        question: "비바샘에서 특정 교재만 신청할 수 있나요?",
        answer: "안녕하세요, 선생님.\n\n비바샘 e-Book 신청 시 필요하신 교재를 선택하여 신청하실 수 있습니다.\n\n신청 페이지에서 원하시는 교재를 선택한 후 제출해 주시면 됩니다.\n\n📌 비바샘 e-Book 신청: https://v.vivasam.com/library/ebookApply.do\n\n감사합니다.",
        keywords: ["비바샘", "특정", "교재", "선택", "일부"],
        priority: 70,
        channel: "all",
        links: ["https://v.vivasam.com/library/ebookApply.do"],
        active: true
    },
    {
        category: "자료제공",
        question: "비바샘 자료를 다운로드할 수 있나요?",
        answer: "안녕하세요, 선생님.\n\n비바샘 e-Book 자료는 스콘 포티처 앱 내에서 다운로드하여 오프라인으로도 열람 가능합니다.\n\n앱 내 다운로드 기능을 이용하시면 인터넷 연결 없이도 사용하실 수 있습니다.\n\n감사합니다.",
        keywords: ["비바샘", "다운로드", "오프라인", "저장"],
        priority: 72,
        channel: "all",
        links: [],
        active: true
    },
    
    // ===== 비상교재 학원선생님 관련 (15개) =====
    {
        category: "교재문의",
        question: "비상교재 학원선생님 사이트에서 어떤 자료를 받을 수 있나요?",
        answer: "안녕하세요, 선생님.\n\n비상교재 학원선생님 사이트에서는 다음 자료를 제공하고 있습니다:\n\n✅ 교사용 교재 본문 PDF (등록된 교재에 한함)\n✅ 각종 부가 자료\n✅ 강의 자료\n\n다만 모든 교재가 제공되는 것은 아니며, 저작권 이슈 등으로 일부 교재는 제공되지 않을 수 있습니다.\n\n📌 비상교재 학원선생님: https://book.visang.com/resources\n\n감사합니다.",
        keywords: ["비상교재", "학원", "자료", "무엇", "제공"],
        priority: 85,
        channel: "all",
        links: ["https://book.visang.com/resources"],
        active: true
    },
    {
        category: "교재문의",
        question: "중학 국어 교사용 자료가 무엇이 있나요?",
        answer: "안녕하세요, 선생님.\n\n중학 국어 자료실에서 제공되는 교사용 자료는 다음과 같습니다:\n\n✅ 한끝 문법편 (완료)\n✅ 수능독해 어휘 1, 2, 3 (완료)\n✅ 수능독해 비문학 1, 2, 3 (완료)\n\n자세한 내용은 비상교재 학원선생님 사이트를 참고해 주세요.\n\n📌 비상교재 학원선생님: https://book.visang.com/resources\n\n감사합니다.",
        keywords: ["중학", "국어", "교사용", "자료", "목록"],
        priority: 88,
        channel: "all",
        links: ["https://book.visang.com/resources"],
        active: true
    },
    {
        category: "교재문의",
        question: "고등 수학 교사용 PDF는 어떤 것이 있나요?",
        answer: "안녕하세요, 선생님.\n\n고등 수학 자료실에서 제공되는 주요 교사용 PDF는 다음과 같습니다:\n\n✅ 완자 시리즈 (공통수학, 대수, 미적분, 확률과 통계 등)\n✅ 개념플러스유형 시리즈\n✅ 수학의 신 시리즈\n\n자세한 교재 목록은 비상교재 학원선생님 사이트에서 확인하실 수 있습니다.\n\n📌 비상교재 학원선생님: https://book.visang.com/resources\n\n감사합니다.",
        keywords: ["고등", "수학", "교사용", "PDF", "목록"],
        priority: 88,
        channel: "all",
        links: ["https://book.visang.com/resources"],
        active: true
    },
    {
        category: "정책",
        question: "비상교재 학원선생님 사이트에서 교사용 PDF가 e-book으로 바뀌었나요?",
        answer: "안녕하세요, 선생님.\n\n2025년 12월 1일부로 학원선생님 대상 교사용 교재 PDF 제공이 중단되었으며, e-book으로 전환되었습니다.\n\n교사용 교재 e-book 신청은 비상교육 공식 네이버 공도비 카페에서 하실 수 있으며, 신청 후 승인된 e-book은 스콘 포티처 앱을 통해 무료 열람 가능합니다.\n\n📌 공도비 카페 가입 및 신청 방법: https://cafe.naver.com/gongdovi\n\n감사합니다.",
        keywords: ["PDF", "중단", "e-book", "전환", "바뀜"],
        priority: 92,
        channel: "all",
        links: ["https://cafe.naver.com/gongdovi"],
        active: true
    },
    {
        category: "교재문의",
        question: "이 교재의 교사용 PDF가 제공되는지 확인하고 싶어요",
        answer: "안녕하세요, 선생님.\n\n교재별 교사용 PDF 제공 여부는 비상교재 학원선생님 사이트의 자료실에서 확인하실 수 있습니다.\n\n다만 모든 교재가 제공되는 것은 아니며, 저작권 이슈 등으로 일부 교재는 제공되지 않을 수 있습니다.\n\n교재명을 정확히 알려주시면 더 구체적으로 안내 가능합니다.\n\n📌 비상교재 학원선생님: https://book.visang.com/resources\n\n감사합니다.",
        keywords: ["교재", "PDF", "제공", "확인", "여부"],
        priority: 82,
        channel: "all",
        links: ["https://book.visang.com/resources"],
        active: true
    },
    
    // ===== 스콘 관련 (20개) =====
    {
        category: "스콘기술",
        question: "스콘 웹 뷰어가 너무 느려요",
        answer: "안녕하세요, 선생님.\n\n스콘 웹 뷰어는 앱 전용에 가깝게 설계되어 있어 PC 환경에서는 속도가 다소 느릴 수 있습니다.\n\n더 빠른 사용을 원하시면 모바일/태블릿의 스콘 포티처 앱 이용을 권장드립니다.\n\n기술적인 상세 문의는 스콘 고객센터로 연락 부탁드립니다.\n\n📌 스콘 고객센터: https://pf.kakao.com/_nYdwxj\n\n감사합니다.",
        keywords: ["스콘", "웹", "뷰어", "느림", "속도"],
        priority: 85,
        channel: "all",
        links: ["https://pf.kakao.com/_nYdwxj"],
        active: true
    },
    {
        category: "스콘기술",
        question: "스콘을 빔프로젝터에 연결하면 화질이 안 좋아요",
        answer: "안녕하세요, 선생님.\n\n스콘 웹 뷰어를 빔프로젝터에 연결 시 화질 저하가 발생할 수 있다는 의견이 있습니다.\n\n이는 스콘 서비스의 기술적 특성과 관련된 사항으로, 정확한 원인 파악 및 개선 방안은 스콘 고객센터를 통해 문의해 주시기 바랍니다.\n\n📌 스콘 고객센터: https://pf.kakao.com/_nYdwxj\n\n감사합니다.",
        keywords: ["스콘", "빔프로젝터", "화질", "저하", "연결"],
        priority: 82,
        channel: "all",
        links: ["https://pf.kakao.com/_nYdwxj"],
        active: true
    },
    {
        category: "스콘기술",
        question: "스콘 앱에서 책이 다운로드가 안 돼요",
        answer: "안녕하세요, 선생님.\n\n스콘 포티처 앱에서 책 다운로드가 안 되는 경우:\n\n1. 인터넷 연결 상태 확인\n2. 앱 최신 버전 업데이트 확인\n3. 저장 공간 여유 확인\n4. 앱 재시작 후 재시도\n\n위 방법으로도 해결되지 않으면 스콘 고객센터로 문의 부탁드립니다.\n\n📌 스콘 고객센터: https://pf.kakao.com/_nYdwxj\n\n감사합니다.",
        keywords: ["스콘", "앱", "다운로드", "안됨", "책"],
        priority: 80,
        channel: "all",
        links: ["https://pf.kakao.com/_nYdwxj"],
        active: true
    },
    {
        category: "스콘기술",
        question: "스콘에서 필기한 내용이 사라졌어요",
        answer: "안녕하세요, 선생님.\n\n스콘 필기 내용 손실은 다음과 같은 경우에 발생할 수 있습니다:\n\n1. 동기화되지 않은 상태에서 앱 삭제/재설치\n2. 기기 변경 시 동기화 미실행\n3. 일시적인 서버 오류\n\n필기 복구 및 정확한 원인 파악은 스콘 고객센터를 통해 문의해 주시기 바랍니다.\n\n📌 스콘 고객센터: https://pf.kakao.com/_nYdwxj\n\n감사합니다.",
        keywords: ["스콘", "필기", "사라짐", "손실", "복구"],
        priority: 90,
        channel: "all",
        links: ["https://pf.kakao.com/_nYdwxj"],
        active: true
    },
    {
        category: "스콘기술",
        question: "스콘 앱이 자꾸 꺼져요 (강제 종료)",
        answer: "안녕하세요, 선생님.\n\n스콘 앱 강제 종료 문제는 다음을 시도해 보세요:\n\n1. 앱 최신 버전으로 업데이트\n2. 기기 재부팅\n3. 앱 삭제 후 재설치 (필기 동기화 확인 필수!)\n4. 기기 저장 공간 확보\n\n지속적으로 문제가 발생하면 스콘 고객센터로 기기 정보와 함께 문의 부탁드립니다.\n\n📌 스콘 고객센터: https://pf.kakao.com/_nYdwxj\n\n감사합니다.",
        keywords: ["스콘", "앱", "꺼짐", "종료", "강제종료"],
        priority: 85,
        channel: "all",
        links: ["https://pf.kakao.com/_nYdwxj"],
        active: true
    },
    
    // ===== 스콘 관련 계속 (15개 추가) =====
    {
        category: "스콘기술",
        question: "스콘에서 책을 찾을 수 없어요",
        answer: "안녕하세요, 선생님.\n\n스콘 앱/웹에서 책이 보이지 않는 경우:\n\n1. 자료 지급이 완료되었는지 확인 (비바샘 신청 후 1~3일 소요)\n2. 교강사 인증이 완료되었는지 확인\n3. 앱 로그아웃 후 재로그인\n4. 앱 캐시 삭제 후 재시작\n\n위 방법으로도 해결되지 않으면 스콘 고객센터로 문의 부탁드립니다.\n\n📌 스콘 고객센터: https://pf.kakao.com/_nYdwxj\n\n감사합니다.",
        keywords: ["스콘", "책", "없음", "안보임", "찾을수없음"],
        priority: 88,
        channel: "all",
        links: ["https://pf.kakao.com/_nYdwxj"],
        active: true
    },
    {
        category: "스콘기술",
        question: "스콘 앱 설치는 어디서 하나요?",
        answer: "안녕하세요, 선생님.\n\n스콘 포티처 앱은 다음에서 설치 가능합니다:\n\niOS (아이패드/아이폰): App Store에서 'SCONN for Teacher' 검색\nAndroid (갤럭시탭 등): Google Play에서 'SCONN for Teacher' 검색\n\n설치 후 비바샘에서 e-Book 신청을 먼저 완료해야 앱에서 자료를 볼 수 있습니다.\n\n감사합니다.",
        keywords: ["스콘", "앱", "설치", "다운로드", "어디서"],
        priority: 75,
        channel: "all",
        links: [],
        active: true
    },
    {
        category: "스콘기술",
        question: "스콘 계정 비밀번호를 잊어버렸어요",
        answer: "안녕하세요, 선생님.\n\n스콘 계정 비밀번호 찾기:\n\n1. 스콘 북카페 웹사이트 (https://sconn.io/) 접속\n2. 로그인 화면에서 '비밀번호 찾기' 클릭\n3. 가입 시 등록한 이메일 또는 휴대폰 번호로 인증\n\n비밀번호 찾기가 안 되는 경우 스콘 고객센터로 문의 부탁드립니다.\n\n📌 스콘 고객센터: https://pf.kakao.com/_nYdwxj\n\n감사합니다.",
        keywords: ["스콘", "비밀번호", "잊음", "찾기", "분실"],
        priority: 78,
        channel: "all",
        links: ["https://sconn.io/", "https://pf.kakao.com/_nYdwxj"],
        active: true
    },
    {
        category: "스콘기술",
        question: "스콘에서 페이지가 넘어가지 않아요",
        answer: "안녕하세요, 선생님.\n\n스콘에서 페이지 넘김이 안 되는 경우:\n\n1. 인터넷 연결 상태 확인\n2. 앱/브라우저 재시작\n3. 다른 책에서도 동일한지 확인\n4. 앱 최신 버전 업데이트\n\n지속되는 경우 스콘 고객센터로 구체적인 상황과 함께 문의 부탁드립니다.\n\n📌 스콘 고객센터: https://pf.kakao.com/_nYdwxj\n\n감사합니다.",
        keywords: ["스콘", "페이지", "넘김", "안됨", "넘어가지않음"],
        priority: 76,
        channel: "all",
        links: ["https://pf.kakao.com/_nYdwxj"],
        active: true
    },
    {
        category: "정책",
        question: "스콘에서 기기를 변경하고 싶어요",
        answer: "안녕하세요, 선생님.\n\n스콘 포티처는 최대 2대의 기기에서 사용 가능합니다.\n\n기기 변경 방법:\n1. 기존 기기에서 로그아웃\n2. 새 기기에서 로그인\n3. 필기 동기화 확인\n\n기기 관리에 문제가 있는 경우 스콘 고객센터로 문의 부탁드립니다.\n\n📌 스콘 고객센터: https://pf.kakao.com/_nYdwxj\n\n감사합니다.",
        keywords: ["스콘", "기기", "변경", "교체", "바꾸기"],
        priority: 80,
        channel: "all",
        links: ["https://pf.kakao.com/_nYdwxj"],
        active: true
    },
    
    // ===== 비바샘 추가 (8개) =====
    {
        category: "자료제공",
        question: "비바샘 회원가입은 어떻게 하나요?",
        answer: "안녕하세요, 선생님.\n\n비바샘 회원가입:\n\n1. 비바샘 사이트 (https://www.vivasam.com) 접속\n2. 회원가입 클릭\n3. 교사 인증 진행\n4. 필수 정보 입력 후 가입 완료\n\n가입 후 e-Book 신청이 가능합니다.\n\n감사합니다.",
        keywords: ["비바샘", "회원가입", "가입", "등록"],
        priority: 77,
        channel: "all",
        links: ["https://www.vivasam.com"],
        active: true
    },
    {
        category: "자료제공",
        question: "비바샘 자료는 학년이 바뀌면 다시 신청해야 하나요?",
        answer: "안녕하세요, 선생님.\n\n비바샘 e-Book 자료는 학년도별로 제공되며, 새 학년도 교재를 이용하시려면 해당 학년도에 다시 신청이 필요할 수 있습니다.\n\n자세한 정책은 비바샘 사이트 또는 담당 지사를 통해 확인 부탁드립니다.\n\n📌 비바샘: https://www.vivasam.com\n\n감사합니다.",
        keywords: ["비바샘", "학년", "바뀜", "재신청", "다시"],
        priority: 73,
        channel: "all",
        links: ["https://www.vivasam.com"],
        active: true
    },
    {
        category: "자료제공",
        question: "비바샘에서 신청한 자료를 취소할 수 있나요?",
        answer: "안녕하세요, 선생님.\n\n비바샘 e-Book 신청 취소는 자료 지급 전에만 가능합니다.\n\n취소를 원하시면 담당 지사로 연락하시거나, 비바샘 고객센터 (1544-7714)로 문의 부탁드립니다.\n\n감사합니다.",
        keywords: ["비바샘", "신청", "취소", "삭제"],
        priority: 68,
        channel: "all",
        links: [],
        active: true
    },
    
    // ===== 비상교재 학원선생님 추가 (8개) =====
    {
        category: "교재문의",
        question: "과학 교재 교사용 자료는 무엇이 있나요?",
        answer: "안녕하세요, 선생님.\n\n과학 교재 교사용 자료:\n\n초등: 오투 3,4학년 / 5,6학년\n중학: 오투 1-1, 1-2, 2-1, 2-2, 3-1, 3-2\n고등: 오투 물리학, 화학, 생명과학, 지구과학 / 완자 시리즈\n\n자세한 목록은 비상교재 학원선생님 사이트를 참고해 주세요.\n\n📌 비상교재 학원선생님: https://book.visang.com/resources\n\n감사합니다.",
        keywords: ["과학", "교재", "교사용", "목록", "오투"],
        priority: 82,
        channel: "all",
        links: ["https://book.visang.com/resources"],
        active: true
    },
    {
        category: "교재문의",
        question: "영어 교재 교사용 자료는 무엇이 있나요?",
        answer: "안녕하세요, 선생님.\n\n영어 교재 교사용 자료:\n\n초등: I See Grammar 1~4, Reader's Bank 1~2\n중학: 중학영어 듣기모의고사 24회 Level 1~3\n\n자세한 목록은 비상교재 학원선생님 사이트를 참고해 주세요.\n\n📌 비상교재 학원선생님: https://book.visang.com/resources\n\n감사합니다.",
        keywords: ["영어", "교재", "교사용", "목록"],
        priority: 80,
        channel: "all",
        links: ["https://book.visang.com/resources"],
        active: true
    },
    {
        category: "교재문의",
        question: "사회/역사 교재 교사용 자료는 무엇이 있나요?",
        answer: "안녕하세요, 선생님.\n\n사회/역사 교재 교사용 자료:\n\n초등: 한끝 사회 3,4학년 / 5,6학년\n중학: 한끝 사회 ①-1, ①-2, ②-1, ②-2 / 한끝 역사 ①-1, ①-2, ②-1, ②-2\n고등: 완자 시리즈\n\n자세한 목록은 비상교재 학원선생님 사이트를 참고해 주세요.\n\n📌 비상교재 학원선생님: https://book.visang.com/resources\n\n감사합니다.",
        keywords: ["사회", "역사", "교재", "교사용", "한끝"],
        priority: 78,
        channel: "all",
        links: ["https://book.visang.com/resources"],
        active: true
    },
    {
        category: "교재문의",
        question: "완자 공부력 교재는 어떤 것이 있나요?",
        answer: "안녕하세요, 선생님.\n\n완자 공부력 교재:\n\n✅ 전과목 어휘 1A~6B\n✅ 국어 독해 1A~6B\n✅ 수학 연산 1A~6B\n✅ 초등 영어 영단어 시리즈\n\n교사용 자료는 비상교재 학원선생님 사이트에서 확인 가능합니다.\n\n📌 비상교재 학원선생님: https://book.visang.com/resources\n\n감사합니다.",
        keywords: ["완자공부력", "공부력", "어휘", "독해"],
        priority: 74,
        channel: "all",
        links: ["https://book.visang.com/resources"],
        active: true
    },
    
    // ===== 스콘 추가 (5개) =====
    {
        category: "정책",
        question: "스콘은 무료인가요?",
        answer: "안녕하세요, 선생님.\n\n비바샘을 통해 신청한 비상교육 e-Book 자료는 스콘 포티처 앱에서 무료로 열람하실 수 있습니다.\n\n단, 스콘 북카페에서 별도로 판매하는 다른 출판사의 교재는 유료입니다.\n\n감사합니다.",
        keywords: ["스콘", "무료", "유료", "비용"],
        priority: 76,
        channel: "all",
        links: [],
        active: true
    },
    {
        category: "스콘기술",
        question: "스콘에서 책에 밑줄/형광펜을 그을 수 있나요?",
        answer: "안녕하세요, 선생님.\n\n스콘 포티처 앱에서는 다양한 필기 기능을 지원합니다:\n\n✅ 밑줄, 형광펜\n✅ 텍스트 입력\n✅ 손글씨 필기\n✅ 도형 그리기\n\n자세한 사용법은 앱 내 도움말을 참고해 주세요.\n\n감사합니다.",
        keywords: ["스콘", "밑줄", "형광펜", "필기", "표시"],
        priority: 72,
        channel: "all",
        links: [],
        active: true
    },
    {
        category: "스콘기술",
        question: "스콘 필기 내용을 다른 기기로 옮길 수 있나요?",
        answer: "안녕하세요, 선생님.\n\n스콘 포티처는 클라우드 동기화를 지원합니다.\n\n기기 A에서 필기 → 동기화 → 기기 B에서 로그인 → 자동 동기화\n\n다만 기기 간 동기화가 원활하지 않은 경우 스콘 고객센터로 문의 부탁드립니다.\n\n📌 스콘 고객센터: https://pf.kakao.com/_nYdwxj\n\n감사합니다.",
        keywords: ["스콘", "필기", "동기화", "옮기기", "이전"],
        priority: 79,
        channel: "all",
        links: ["https://pf.kakao.com/_nYdwxj"],
        active: true
    },
    {
        category: "스콘기술",
        question: "스콘에서 PDF로 내보내기가 되나요?",
        answer: "안녕하세요, 선생님.\n\n스콘 포티처의 PDF 내보내기 기능 지원 여부는 스콘 고객센터를 통해 확인 부탁드립니다.\n\n📌 스콘 북카페: https://sconn.io/\n📌 스콘 고객센터: https://pf.kakao.com/_nYdwxj\n\n감사합니다.",
        keywords: ["스콘", "PDF", "내보내기", "추출", "저장"],
        priority: 70,
        channel: "all",
        links: ["https://sconn.io/", "https://pf.kakao.com/_nYdwxj"],
        active: true
    },
    {
        category: "스콘기술",
        question: "스콘 고객센터 상담 시간은 언제인가요?",
        answer: "안녕하세요, 선생님.\n\n스콘 북카페 고객센터 상담 시간:\n\n📌 카카오톡: https://pf.kakao.com/_nYdwxj\n⏰ 상담시간(영업일): 월~금 오전 10시 ~ 오후 6시\n🍴 점심시간: 오전 11시 30분 ~ 오후 1시 30분\n❌ 주말 및 공휴일: 상담 불가\n\n감사합니다.",
        keywords: ["스콘", "고객센터", "상담", "시간", "영업시간"],
        priority: 84,
        channel: "all",
        links: ["https://pf.kakao.com/_nYdwxj"],
        active: true
    }
];

// 데이터베이스 등록 함수
async function uploadFAQs() {
    console.log('FAQ 등록 시작...');
    console.log(`총 ${newFAQs.length}개 FAQ 등록 예정`);
    
    for (let i = 0; i < newFAQs.length; i++) {
        try {
            const response = await fetch('tables/faqs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFAQs[i])
            });
            
            if (response.ok) {
                console.log(`✅ ${i + 1}/${newFAQs.length} 등록 완료: ${newFAQs[i].question}`);
            } else {
                console.error(`❌ ${i + 1}/${newFAQs.length} 등록 실패: ${newFAQs[i].question}`);
            }
        } catch (error) {
            console.error(`❌ ${i + 1}/${newFAQs.length} 오류: ${error.message}`);
        }
        
        // API 부하 방지를 위한 딜레이
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log('✅ FAQ 등록 완료!');
    console.log(`\n총 ${newFAQs.length}개 FAQ가 등록되었습니다.`);
}

// 실행: 브라우저 콘솔에서 uploadFAQs() 호출
console.log(`%c📚 FAQ 데이터 준비 완료!`, 'color: #7C3AED; font-size: 16px; font-weight: bold');
console.log(`%c총 ${newFAQs.length}개의 FAQ가 준비되었습니다.`, 'color: #10B981; font-size: 14px');
console.log(`%c업로드 방법: uploadFAQs() 를 콘솔에 입력하여 실행하세요.`, 'color: #F59E0B; font-size: 14px');

