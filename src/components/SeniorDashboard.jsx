import { useState, useMemo } from 'react';
import { User, LogOut, Briefcase, FileText, Clock, CheckCircle, Star } from 'lucide-react';
import { api } from '../utils/api';
import SeniorProfile from './SeniorProfile';

// 고용형태 한글 매핑
const JOB_TYPE_MAP = {
  both: "실내·실외 모두",
  office: "실내 업무",
  field: "실외 업무",
};

export default function SeniorDashboard({
  user,
  jobPostings,
  applications,
  employmentHistories,
  refreshData,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedJob, setSelectedJob] = useState(null);
  const [page, setPage] = useState('dashboard');

  const myApplications = applications.filter((app) => app.senior_id === user.id);
  const myHistories = employmentHistories.filter((h) => h.senior_id === user.id);
  const currentJob = myHistories.find((h) => h.status === 'active');

  // 요일 정렬 및 한글 변환 함수
  const formatDays = (daysString) => {
    if (!daysString) return "";
    const dayOrder = { MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6, SUN: 7 };
    const dayMap = { MON: "월", TUE: "화", WED: "수", THU: "목", FRI: "금", SAT: "토", SUN: "일" };

    return daysString
      .split(",")
      .map((d) => d.trim())
      .sort((a, b) => (dayOrder[a] || 99) - (dayOrder[b] || 99))
      .map((d) => dayMap[d] || d)
      .join(", ");
  };
// 1. 업무 유형 한글 <-> 영어 통일 함수
  const normalizeType = (type) => {
    if (!type) return '';
    if (type === '실내·실외 모두' || type === 'both') return 'both';
    if (type === '실내 업무' || type === 'office') return 'office';
    if (type === '실외 업무' || type === 'field') return 'field';
    return type; 
  };
  // 시간("09:00") -> 분(540) 변환 함수
  const timeToMin = (timeStr) => {
    if (!timeStr || !timeStr.includes(':')) return null;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };
// ✅ [핵심] 정교한 점수 계산 로직
  const calculateScore = (job) => {
    if (!user) return 0;

    const uLoc = user.location || user.preferences?.workLocation || '';
    const uType = user.employment_type || user.preferences?.jobType || '';
    const uDays = user.work_days || ''; 
    const uHours = user.work_hours || ''; // 예: "09:00-18:00"

    let totalScore = 0;

    // ---------------------------------------------------
    // 1. 지역 (40점) - 포함 관계면 점수 부여
    // ---------------------------------------------------
    if (uLoc && job.location) {
      const cleanUserLoc = uLoc.replace(/\s+/g, '');
      const cleanJobLoc = job.location.replace(/\s+/g, '');
      // 서로 포함하면 일치로 판단 (강남구 <-> 서울강남구)
      if (cleanJobLoc.includes(cleanUserLoc) || cleanUserLoc.includes(cleanJobLoc)) {
        totalScore += 40;
      }
    }

    // ---------------------------------------------------
    // 2. 근무 요일 (25점) - 겹치는 요일 개수에 따라 가산점
    // ---------------------------------------------------
    if (uDays && job.work_days) {
      const uDayList = uDays.split(',').map(d => d.trim());     // 내 선호: 월,수,금
      const jDayList = job.work_days.split(',').map(d => d.trim()); // 공고: 수,금
      
      // 겹치는 요일 개수 확인
      const intersection = uDayList.filter(d => jDayList.includes(d)).length; 
      
      if (intersection > 0) {
        // 공고 요일 중 내가 며칠이나 가능한지 비율로 계산
        // (예: 공고가 2일인데 내가 2일 다 가능하면 100% 점수)
        const ratio = Math.min(intersection / jDayList.length, 1); 
        totalScore += Math.round(ratio * 25);
      }
    } else if (!uDays) {
      // 요일 선호가 없으면 기본 점수 10점 (너무 불리하지 않게)
      totalScore += 10;
    }

    // ---------------------------------------------------
    // 3. 근무 시간 (20점) - 시간 포함 여부 계산
    // ---------------------------------------------------
    if (uHours && job.work_hours && uHours.includes('-') && job.work_hours.includes('-')) {
      const [uStartStr, uEndStr] = uHours.split('-');
      const [jStartStr, jEndStr] = job.work_hours.split('-');

      const uStart = timeToMin(uStartStr);
      const uEnd = timeToMin(uEndStr);
      const jStart = timeToMin(jStartStr);
      const jEnd = timeToMin(jEndStr);

      if (uStart !== null && jStart !== null) {
        // 공고 시간(Job)이 내 선호 시간(User) 안에 얼마나 포함되는지 확인
        // 교집합 시간 구하기
        const overlapStart = Math.max(uStart, jStart);
        const overlapEnd = Math.min(uEnd, jEnd);
        const overlapDuration = Math.max(0, overlapEnd - overlapStart); // 겹치는 분(min)
        
        const jobDuration = jEnd - jStart; // 공고의 총 근무 시간

        if (jobDuration > 0 && overlapDuration > 0) {
          // 공고 시간 대비 겹치는 시간 비율 (100% 겹치면 만점)
          const timeRatio = Math.min(overlapDuration / jobDuration, 1);
          totalScore += Math.round(timeRatio * 20);
        }
      }
    } else {
        // 시간 정보가 없거나 형식이 안 맞으면 기본점수
        totalScore += 5; 
    }

    // ---------------------------------------------------
    // 4. 업무 유형 (15점) - 정규화 후 비교
    // ---------------------------------------------------
    const normUserType = normalizeType(uType);
    const normJobType = normalizeType(job.employment_type);

    if (normUserType === 'both' || normJobType === 'both' || normUserType === normJobType) {
      totalScore += 15;
    }

    return totalScore;
  };

// ✅ [수정] 추천 리스트 생성 (커트라인 50점으로 상향)
  const recommendedJobs = useMemo(() => {
    if (!user) return [];

    const approved = jobPostings.filter((job) => job.status === 'approved');

    // 1. 모든 공고에 점수 매기기
    const scoredJobs = approved.map(job => ({
      ...job,
      matchScore: calculateScore(job)
    }));

    // 2. 점수 높은 순 정렬
    // 50점 이상 필터링: (지역 30 + 업무 20) 처럼 최소한의 조건 2개는 맞아야 뜸
    return scoredJobs
      .filter(job => job.matchScore >= 50) 
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [jobPostings, user]);

  const hasApplied = (jobId) => {
    return myApplications.some((app) => app.job_id === jobId);
  };

  const handleApply = async (jobId) => {
    try {
      const applicationData = { job_id: jobId, senior_id: user.id };
      await api.createApplication(applicationData);
      await refreshData();
      setSelectedJob(null);
      alert('지원이 완료되었습니다.');
    } catch (error) {
      console.error(error);
      alert('이미 지원했거나 오류가 발생했습니다.');
    }
  };

  if (page === 'profile') {
    return (
      <SeniorProfile
        user={user}
        applications={applications}
        employmentHistories={employmentHistories}
        refreshData={refreshData}
        onBack={() => setPage('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold text-white">시니어 대시보드</h1>
                <p className="text-blue-100">{user.name}님 환영합니다</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage('profile')} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-medium">
                <User className="w-5 h-5" /> 내 프로필
              </button>
              <button onClick={onLogout} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-medium">
                <LogOut className="w-5 h-5" /> 로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Current Job Alert */}
        {currentJob && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-900 mb-2">현재 근무중입니다!</h3>
                <p className="text-green-800 mb-1"><span className="font-medium">{currentJob.company_name}</span> - {currentJob.job_title}</p>
                <p className="text-green-700 text-sm">근무 시작일: {currentJob.start_date}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">맞춤 일자리</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{recommendedJobs.length}건</p>
              </div>
              <Briefcase className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">지원 내역</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{myApplications.length}건</p>
              </div>
              <FileText className="w-10 h-10 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">근무 이력</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{myHistories.length}건</p>
              </div>
              <Clock className="w-10 h-10 text-green-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button onClick={() => setActiveTab('jobs')} className={`pb-4 px-4 font-medium transition ${activeTab === 'jobs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              추천 일자리
            </button>
            <button onClick={() => setActiveTab('applications')} className={`pb-4 px-4 font-medium transition ${activeTab === 'applications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              지원 내역
            </button>
            <button onClick={() => setActiveTab('history')} className={`pb-4 px-4 font-medium transition ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              이력 관리
            </button>
          </div>

          {/* Jobs Tab (AI 추천 적용됨) */}
          {activeTab === 'jobs' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                {user.name}님을 위한 추천 일자리
              </h2>

              <div className="space-y-4">
                {recommendedJobs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>조건에 맞는 추천 일자리가 없습니다.<br/>프로필에서 선호 근무 조건을 수정해보세요.</p>
                  </div>
                ) : (
                  recommendedJobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition relative">
                      
                      {/* 매칭 점수 뱃지 */}
                      <div className="absolute top-5 right-5 flex flex-col items-end">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${
                          job.matchScore >= 80 ? 'bg-red-100 text-red-700' : 
                          job.matchScore >= 60 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          <Star className="w-3 h-3 fill-current" />
                          적합도 {job.matchScore}%
                        </span>
                      </div>

                      <div className="flex items-start justify-between mb-3 pr-24">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                          <p className="text-gray-600 mb-2">{job.company_name}</p>
                          <p className="text-gray-700 line-clamp-2">{job.description}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 mb-4 text-gray-700 mt-4">
                        <div><span className="text-gray-500 font-medium">근무지:</span> {job.location}</div>
                        <div><span className="text-gray-500 font-medium">고용형태:</span> {JOB_TYPE_MAP[job.employment_type] || job.employment_type}</div>
                        <div><span className="text-gray-500 font-medium">시급:</span> {job.wage_amount.toLocaleString()}원</div>
                        <div><span className="text-gray-500 font-medium">근무일:</span> {formatDays(job.work_days)}</div>
                        <div><span className="text-gray-500 font-medium">근무시간:</span> {job.work_hours}</div>
                        <div><span className="text-gray-500 font-medium">근무기간:</span> {job.work_period}</div>
                      </div>

                      {hasApplied(job.id) ? (
                        <button disabled className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg cursor-not-allowed font-medium">
                          이미 지원함
                        </button>
                      ) : (
                        <button onClick={() => setSelectedJob(job)} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium">
                          지원하기
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Applications & History Tab (기존 동일) */}
          {activeTab === 'applications' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">지원 내역</h2>
              <div className="space-y-4">
                {myApplications.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>지원한 일자리가 없습니다.</p>
                  </div>
                ) : (
                  myApplications.map((app) => {
                    const job = jobPostings.find((j) => j.id === app.job_id);
                    return (
                      <div key={app.id} className="border border-gray-200 rounded-lg p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{job?.title}</h3>
                            <p className="text-gray-600">{job?.company_name}</p>
                            <p className="text-sm text-gray-500">지원일: {app.application_date}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            app.status === 'approved' ? 'bg-green-100 text-green-800' :
                            app.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {app.status === 'approved' ? '승인됨 (근무 시작)' :
                             app.status === 'interview' ? '면접 예정' :
                             app.status === 'rejected' ? '거절됨' : '검토중'}
                          </span>
                        </div>
                        {app.status === 'approved' && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-green-800 font-medium">✓ 채용되었습니다! 이력관리에서 근무 내역을 확인하실 수 있습니다.</p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">이력 관리</h2>
              <div className="space-y-4">
                {myHistories.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>근무 이력이 없습니다.</p>
                  </div>
                ) : (
                  myHistories.map((history) => (
                    <div key={history.id} className="border border-gray-200 rounded-lg p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{history.job_title}</h3>
                          <p className="text-gray-600">{history.company_name}</p>
                          <div className="mt-2 space-y-1 text-gray-700">
                            <p><span className="text-gray-500 font-medium">근무 시작:</span> {history.start_date}</p>
                            {history.end_date && <p><span className="text-gray-500 font-medium">근무 종료:</span> {history.end_date}</p>}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            history.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {history.status === 'active' ? '근무중' : '근무 완료'}
                          </span>
                          {history.verified && (
                            <span className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                              <CheckCircle className="w-4 h-4" /> 검증된 이력
                            </span>
                          )}
                        </div>
                      </div>
                      {history.status === 'active' && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-blue-800">💼 현재 이 회사에서 근무 중입니다.</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Apply Confirmation Modal (기존 동일) */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">지원 확인</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-1 font-medium">공고 제목</label>
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg text-lg">{selectedJob.title}</p>
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">기업명</label>
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{selectedJob.company_name}</p>
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">근무 조건</label>
                <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                  <p className="text-gray-700"><span className="font-medium">근무지:</span> {selectedJob.location}</p>
                  <p className="text-gray-700"><span className="font-medium">시급:</span> {selectedJob.wage_amount.toLocaleString()}원</p>
                  <p className="text-gray-700"><span className="font-medium">근무일:</span> {formatDays(selectedJob.work_days)}</p>
                  <p className="text-gray-700"><span className="font-medium">근무시간:</span> {selectedJob.work_hours}</p>
                </div>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-center">이 공고에 지원하시겠습니까?<br />기업에서 검토 후 연락드립니다.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleApply(selectedJob.id)} className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium">지원하기</button>
              <button onClick={() => setSelectedJob(null)} className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium">취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}