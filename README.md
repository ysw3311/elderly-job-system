# 노인 일자리 추천 시스템 (Elderly Job Recommendation System)

노인을 위한 일자리 매칭 플랫폼으로, 정부-기업-노인을 연결하는 통합 시스템입니다.

## 🌟 주요 기능

### 1. 정부 관리 시스템
- 기업이 등록한 일자리 공고 검토 및 승인/거절
- 품질 관리를 통한 노인 보호
- 승인된 공고만 노인 회원에게 공개

### 2. 기업 대시보드
- 일자리 공고 등록 및 관리
- 정부에 승인 요청
- 지원자 관리 (승인/면접/거절)
- 승인 시 자동으로 이력관리 시스템에 등록

### 3. 노인(시니어) 대시보드
- 정부 승인된 일자리 검색 및 열람
- 클릭 한 번으로 간편 지원
- 지원 현황 실시간 확인
- 자동 이력 관리 (근무중/근무완료)

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0 이상
- npm 또는 yarn

### 설치 방법

1. 프로젝트 디렉토리로 이동
```bash
cd elderly-job-system
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm run dev
```

4. 브라우저에서 접속
```
http://localhost:3000
```

## 🎭 데모 계정

시스템을 테스트하려면 다음 데모 계정을 사용하세요:

### 정부 관리자
- ID: `gov_admin`
- PW: `gov123`

### 기업 계정
- **삼성전자**
  - ID: `company_samsung`
  - PW: `comp123`
  
- **현대백화점**
  - ID: `company_hyundai`
  - PW: `comp123`

### 노인 회원
- **김영희 (근무중)**
  - ID: `senior_kim`
  - PW: `senior123`
  
- **박철수 (구직중)**
  - ID: `senior_park`
  - PW: `senior123`

## 📱 워크플로우

### 완전한 시나리오

1. **기업** → 새 공고 등록 → 정부에 승인 요청
2. **정부** → 공고 검토 → 승인/거절
3. **노인** → 승인된 공고 확인 → 지원
4. **기업** → 지원자 검토 → 승인/면접/거절
5. **자동** → 승인 시 이력관리에 자동 등록
6. **노인** → 이력관리에서 근무 내역 확인

## 🛠️ 기술 스택

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: LocalStorage (로컬 데이터 저장)

## 📁 프로젝트 구조

```
elderly-job-system/
├── public/
│   └── (정적 파일)
├── src/
│   ├── components/
│   │   ├── MainPage.jsx           # 메인 랜딩 페이지
│   │   ├── Login.jsx              # 로그인 페이지
│   │   ├── SignUp.jsx             # 회원가입 페이지
│   │   ├── GovernmentDashboard.jsx # 정부 대시보드
│   │   ├── CompanyDashboard.jsx    # 기업 대시보드
│   │   └── SeniorDashboard.jsx     # 노인 대시보드
│   ├── utils/
│   │   └── storage.js             # 로컬스토리지 유틸리티
│   ├── App.jsx                    # 메인 앱 컴포넌트
│   ├── main.jsx                   # 진입점
│   └── index.css                  # 전역 스타일
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 💾 데이터 관리

이 시스템은 **LocalStorage**를 사용하여 데이터를 저장합니다:

- 사용자 정보 (회원가입 데이터)
- 일자리 공고
- 지원 내역
- 근무 이력

**주의**: 브라우저 캐시를 삭제하면 데이터가 초기화됩니다.

## 🎨 주요 특징

### 1. 정부 승인 시스템
- 모든 공고는 정부의 1차 검토를 거쳐 승인
- 불법적이거나 부적절한 공고 사전 차단

### 2. 자동 이력 관리
- 채용 승인 시 자동으로 근무 이력 생성
- 근무 기간 자동 추적 (시작일, 종료일)
- 검증된 이력으로 영구 보관

### 3. 직관적인 UI/UX
- 어르신을 위한 큰 글씨와 명확한 버튼
- 단계별 명확한 피드백
- 색상으로 구분된 역할별 디자인

### 4. 실시간 상태 관리
- React Hooks를 활용한 실시간 데이터 동기화
- 즉각적인 UI 업데이트

## 🔒 보안

- 비밀번호는 평문으로 저장 (데모 목적)
- 실제 운영 시에는 백엔드와 암호화 필수

## 🐛 알려진 이슈

- LocalStorage 사용으로 브라우저 간 데이터 공유 불가
- 실제 이메일/SMS 알림 기능 없음 (데모 시스템)

## 📝 라이선스

MIT License

## 👥 기여

기여를 환영합니다! Pull Request를 제출해주세요.

## 📧 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.

---

**Made with ❤️ for Senior Citizens**
