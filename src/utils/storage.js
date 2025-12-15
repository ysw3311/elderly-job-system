// 로컬스토리지 키 상수
const STORAGE_KEYS = {
  USERS: 'elderly_system_users',
  JOB_POSTINGS: 'elderly_system_job_postings',
  APPLICATIONS: 'elderly_system_applications',
  EMPLOYMENT_HISTORIES: 'elderly_system_employment_histories',
  CURRENT_USER: 'elderly_system_current_user',
};

// 로컬스토리지에서 데이터 가져오기
export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
};

// 로컬스토리지에 데이터 저장
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

// 로컬스토리지에서 데이터 삭제
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

// 초기 데이터 설정
export const initializeStorage = () => {
  // 기본 사용자 계정 (데모용)
  const defaultUsers = getFromStorage(STORAGE_KEYS.USERS) || [
    {
      id: 'gov_001',
      username: 'gov_admin',
      password: 'gov123',
      role: 'government',
      name: '정부 관리자',
    },
    {
      id: 'company_001',
      username: 'company_samsung',
      password: 'comp123',
      role: 'company',
      name: '삼성전자',
      companyInfo: {
        businessNumber: '123-45-67890',
        address: '서울 강남구',
      },
    },
    {
      id: 'company_002',
      username: 'company_hyundai',
      password: 'comp123',
      role: 'company',
      name: '현대백화점',
      companyInfo: {
        businessNumber: '098-76-54321',
        address: '서울 중구',
      },
    },
    {
      id: 'senior_001',
      username: 'senior_kim',
      password: 'senior123',
      role: 'senior',
      name: '김영희',
      phone: '010-1234-5678',
      preferences: {
        jobType: 'office',
        workStartTime: '09:00',
        workEndTime: '14:00',
        workLocation: '서울 강남구',
      },
    },
    {
      id: 'senior_002',
      username: 'senior_park',
      password: 'senior123',
      role: 'senior',
      name: '박철수',
      phone: '010-9876-5432',
      preferences: {
        jobType: 'both',
        workStartTime: '10:00',
        workEndTime: '15:00',
        workLocation: '서울 중구',
      },
    },
  ];

  // 기본 공고 데이터
  const defaultJobPostings = getFromStorage(STORAGE_KEYS.JOB_POSTINGS) || [
    {
      id: 'job_001',
      company_id: 'company_001',
      company_name: '삼성전자',
      title: '시설 관리 보조',
      description: '사무실 환경 관리 및 간단한 시설 점검 업무',
      location: '서울 강남구',
      employment_type: '시간제',
      wage_amount: 12000,
      work_days: '월, 수, 금',
      work_hours: '09:00-13:00',
      work_period: '6개월',
      status: 'approved',
      government_approved: true,
      posted_at: '2025-11-15',
      deadline: '2025-12-15',
    },
    {
      id: 'job_002',
      company_id: 'company_002',
      company_name: '현대백화점',
      title: '고객 안내 도우미',
      description: '매장 내 고객 안내 및 간단한 상담 업무',
      location: '서울 중구',
      employment_type: '시간제',
      wage_amount: 13000,
      work_days: '화, 목',
      work_hours: '10:00-15:00',
      work_period: '3개월',
      status: 'pending_approval',
      government_approved: false,
      posted_at: '2025-11-20',
      deadline: '2025-12-20',
    },
  ];

  // 기본 지원 데이터
  const defaultApplications = getFromStorage(STORAGE_KEYS.APPLICATIONS) || [
    {
      id: 'app_001',
      job_id: 'job_001',
      senior_id: 'senior_001',
      senior_name: '김영희',
      application_date: '2025-11-18',
      status: 'approved',
      notes: '경력과 근무조건이 적합함',
    },
  ];

  // 기본 이력 데이터
  const defaultEmploymentHistories = getFromStorage(STORAGE_KEYS.EMPLOYMENT_HISTORIES) || [
    {
      id: 'hist_001',
      senior_id: 'senior_001',
      job_id: 'job_001',
      company_id: 'company_001',
      company_name: '삼성전자',
      job_title: '시설 관리 보조',
      start_date: '2025-11-20',
      end_date: null,
      status: 'active',
      verified: true,
    },
  ];

  // 초기 데이터 저장
  if (!getFromStorage(STORAGE_KEYS.USERS)) {
    saveToStorage(STORAGE_KEYS.USERS, defaultUsers);
  }
  if (!getFromStorage(STORAGE_KEYS.JOB_POSTINGS)) {
    saveToStorage(STORAGE_KEYS.JOB_POSTINGS, defaultJobPostings);
  }
  if (!getFromStorage(STORAGE_KEYS.APPLICATIONS)) {
    saveToStorage(STORAGE_KEYS.APPLICATIONS, defaultApplications);
  }
  if (!getFromStorage(STORAGE_KEYS.EMPLOYMENT_HISTORIES)) {
    saveToStorage(STORAGE_KEYS.EMPLOYMENT_HISTORIES, defaultEmploymentHistories);
  }
};

export { STORAGE_KEYS };
