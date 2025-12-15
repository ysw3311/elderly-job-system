import { useState, useEffect } from 'react';
import MainPage from './components/MainPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import GovernmentDashboard from './components/GovernmentDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import SeniorDashboard from './components/SeniorDashboard';
import { api } from './utils/api'; // api 연결

function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [signupRole, setSignupRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [jobPostings, setJobPostings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [employmentHistories, setEmploymentHistories] = useState([]);

  // 데이터 로드 함수 (백엔드에서 가져오기)
  const loadData = async () => {
    try {
      const [jobs, apps, histories] = await Promise.all([
        api.getJobs(),
        api.getApplications(),
        api.getHistories()
      ]);
      setJobPostings(jobs);
      setApplications(apps);
      setEmploymentHistories(histories);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  // 초기 실행 시 데이터 로드 및 로그인 세션 복구
  useEffect(() => {
    loadData();
    const savedUser = localStorage.getItem('senior_job_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // 로그아웃
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('senior_job_user');
    setCurrentPage('main');
  };

  // 로그인 성공 처리
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('senior_job_user', JSON.stringify(user));
    // 로그인 후 최신 데이터 다시 로드
    loadData();
  };

  // 회원가입 페이지 이동
  const handleSignUp = (role) => {
    setSignupRole(role);
    setCurrentPage('signup');
  };

  // 회원가입 API 요청
  const handleRegister = async (userData) => {
    try {
      await api.register(userData);
      alert("회원가입이 완료되었습니다. 로그인해주세요.");
      setCurrentPage('login');
    } catch (error) {
      alert("회원가입 실패: " + (error.response?.data?.message || "오류가 발생했습니다."));
    }
  };

  // 렌더링 로직 (로그인 상태)
  if (currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        {currentUser.role === 'government' && (
          <GovernmentDashboard
            user={currentUser}
            jobPostings={jobPostings}
            refreshData={loadData} // 데이터 갱신 함수 전달
            onLogout={handleLogout}
          />
        )}
        {currentUser.role === 'company' && (
          <CompanyDashboard
            user={currentUser}
            jobPostings={jobPostings}
            applications={applications}
            employmentHistories={employmentHistories}
            refreshData={loadData} // 데이터 갱신 함수 전달
            onLogout={handleLogout}
          />
        )}
        {currentUser.role === 'senior' && (
          <SeniorDashboard
            user={currentUser}
            jobPostings={jobPostings}
            applications={applications}
            employmentHistories={employmentHistories}
            refreshData={loadData} // 데이터 갱신 함수 전달
            onLogout={handleLogout}
          />
        )}
      </div>
    );
  }

  // 렌더링 로직 (비로그인 상태)
  if (currentPage === 'login') {
    return (
      <Login
        onLogin={handleLoginSuccess}
        onBack={() => setCurrentPage('main')}
      />
    );
  }

  if (currentPage === 'signup' && signupRole) {
    return (
      <SignUp
        role={signupRole}
        onRegister={handleRegister}
        onBack={() => setCurrentPage('main')}
      />
    );
  }

  return (
    <MainPage
      onLogin={() => setCurrentPage('login')}
      onSignUp={handleSignUp}
    />
  );
}

export default App;