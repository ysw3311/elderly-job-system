import { useState } from 'react';
import { User, LogOut, Briefcase, FileText, Clock, CheckCircle } from 'lucide-react';
import { api } from '../utils/api';
import SeniorProfile from './SeniorProfile';

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

  // ✅ 페이지 전환 상태 추가(사용)
  const [page, setPage] = useState('dashboard'); // 'dashboard' | 'profile'

  const myApplications = applications.filter((app) => app.senior_id === user.id);
  const myHistories = employmentHistories.filter((h) => h.senior_id === user.id);
  const currentJob = myHistories.find((h) => h.status === 'active');
  const approvedJobs = jobPostings.filter((job) => job.status === 'approved');

  const hasApplied = (jobId) => {
    return myApplications.some((app) => app.job_id === jobId);
  };

  const handleApply = async (jobId) => {
    try {
      const applicationData = {
        job_id: jobId,
        senior_id: user.id,
      };

      await api.createApplication(applicationData);
      await refreshData();

      setSelectedJob(null);
      alert('지원이 완료되었습니다.');
    } catch (error) {
      console.error(error);
      alert('이미 지원했거나 오류가 발생했습니다.');
    }
  };

  // ✅ 프로필 페이지로 전환되면 SeniorProfile만 렌더링
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
              {/* ✅ 내 프로필 버튼 추가 */}
              <button
                onClick={() => setPage('profile')}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-medium"
              >
                <User className="w-5 h-5" />
                내 프로필
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-medium"
              >
                <LogOut className="w-5 h-5" />
                로그아웃
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
                <p className="text-green-800 mb-1">
                  <span className="font-medium">{currentJob.company_name}</span> - {currentJob.job_title}
                </p>
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
                <p className="text-gray-600 font-medium">추천 일자리</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{approvedJobs.length}건</p>
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
            <button
              onClick={() => setActiveTab('jobs')}
              className={`pb-4 px-4 font-medium transition ${
                activeTab === 'jobs'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              추천 일자리
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`pb-4 px-4 font-medium transition ${
                activeTab === 'applications'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              지원 내역
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-4 px-4 font-medium transition ${
                activeTab === 'history'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              이력 관리
            </button>
          </div>

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">추천 일자리</h2>

              <div className="space-y-4">
                {approvedJobs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>현재 추천할 수 있는 일자리가 없습니다.</p>
                  </div>
                ) : (
                  approvedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                          <p className="text-gray-600 mb-2">{job.company_name}</p>
                          <p className="text-gray-700">{job.description}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          정부 승인
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 mb-4 text-gray-700">
                        <div>
                          <span className="text-gray-500 font-medium">근무지:</span> {job.location}
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium">고용형태:</span> {job.employment_type}
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium">시급:</span> {job.wage_amount.toLocaleString()}원
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium">근무일:</span> {job.work_days}
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium">근무시간:</span> {job.work_hours}
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium">근무기간:</span> {job.work_period}
                        </div>
                      </div>

                      {hasApplied(job.id) ? (
                        <button
                          disabled
                          className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg cursor-not-allowed font-medium"
                        >
                          이미 지원함
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                          지원하기
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Applications Tab */}
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
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              app.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : app.status === 'interview'
                                ? 'bg-purple-100 text-purple-800'
                                : app.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {app.status === 'approved'
                              ? '승인됨 (근무 시작)'
                              : app.status === 'interview'
                              ? '면접 예정'
                              : app.status === 'rejected'
                              ? '거절됨'
                              : '검토중'}
                          </span>
                        </div>

                        {app.status === 'approved' && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-green-800 font-medium">
                              ✓ 채용되었습니다! 이력관리에서 근무 내역을 확인하실 수 있습니다.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* History Tab */}
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
                            <p>
                              <span className="text-gray-500 font-medium">근무 시작:</span> {history.start_date}
                            </p>
                            {history.end_date && (
                              <p>
                                <span className="text-gray-500 font-medium">근무 종료:</span> {history.end_date}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              history.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {history.status === 'active' ? '근무중' : '근무 완료'}
                          </span>

                          {history.verified && (
                            <span className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                              <CheckCircle className="w-4 h-4" />
                              검증된 이력
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

      {/* Apply Confirmation Modal */}
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
                  <p className="text-gray-700">
                    <span className="font-medium">근무지:</span> {selectedJob.location}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">시급:</span> {selectedJob.wage_amount.toLocaleString()}원
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">근무일:</span> {selectedJob.work_days}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">근무시간:</span> {selectedJob.work_hours}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-center">
                  이 공고에 지원하시겠습니까?<br />
                  기업에서 검토 후 연락드립니다.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleApply(selectedJob.id)}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                지원하기
              </button>
              <button
                onClick={() => setSelectedJob(null)}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
