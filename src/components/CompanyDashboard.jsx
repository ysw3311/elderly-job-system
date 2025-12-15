import { useState } from 'react';
import { Building2, LogOut, Plus, FileText, Users, Briefcase } from 'lucide-react';
import { api } from '../utils/api'; // API import

export default function CompanyDashboard({
  user,
  jobPostings,
  applications,
  employmentHistories,
  refreshData, // App.jsx에서 받은 데이터 갱신 함수
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState('postings');
  const [showNewJobForm, setShowNewJobForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    location: '',
    employment_type: '시간제',
    wage_amount: '',
    work_days: '',
    work_hours: '',
    work_period: '',
    deadline: '',
  });

  const myJobPostings = jobPostings.filter((job) => job.company_id === user.id);
  const myApplications = applications.filter((app) =>
    myJobPostings.some((job) => job.id === app.job_id)
  );

  // 공고 생성 핸들러 (API 호출)
  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        company_id: user.id,
        ...newJob,
        wage_amount: parseInt(newJob.wage_amount),
      };

      await api.createJob(jobData); // 백엔드 전송
      await refreshData(); // 전체 데이터 다시 불러오기 (ID 동기화 등을 위해)
      
      setShowNewJobForm(false);
      setNewJob({
        title: '',
        description: '',
        location: '',
        employment_type: '시간제',
        wage_amount: '',
        work_days: '',
        work_hours: '',
        work_period: '',
        deadline: '',
      });
      alert('공고가 등록되었습니다. 정부 승인 대기 중입니다.');
    } catch (error) {
      alert('공고 등록 실패');
      console.error(error);
    }
  };

  // 지원자 상태 변경 핸들러 (API 호출)
  const handleApplicationAction = async (appId, newStatus) => {
    try {
      await api.updateApplicationStatus(appId, newStatus);
      await refreshData();
    } catch (error) {
      console.error(error);
      alert('상태 변경 실패');
    }
  };

  // ... (이하 return 문 내부 UI 코드는 기존과 동일하되, 함수 호출부만 위 핸들러로 연결됨)
  // return 코드는 분량상 생략하지 않고 제공합니다.
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold text-white">기업 대시보드</h1>
                <p className="text-green-100">{user.name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-medium"
            >
              <LogOut className="w-5 h-5" />
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">등록한 공고</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{myJobPostings.length}건</p>
              </div>
              <FileText className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">받은 지원</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{myApplications.length}건</p>
              </div>
              <Users className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">승인 완료</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {myApplications.filter((a) => a.status === 'approved').length}건
                </p>
              </div>
              <Briefcase className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('postings')}
              className={`pb-4 px-4 font-medium transition ${
                activeTab === 'postings'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              등록한 공고
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`pb-4 px-4 font-medium transition ${
                activeTab === 'applications'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              지원자 관리
            </button>
          </div>

          {/* Job Postings Tab */}
          {activeTab === 'postings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">등록한 공고</h2>
                <button
                  onClick={() => setShowNewJobForm(true)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                >
                  <Plus className="w-5 h-5" />
                  새 공고 등록
                </button>
              </div>

              <div className="space-y-4">
                {myJobPostings.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>등록한 공고가 없습니다.</p>
                  </div>
                ) : (
                  myJobPostings.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                          <p className="text-gray-600">{job.description}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            job.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : job.status === 'pending_approval'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {job.status === 'approved'
                            ? '승인됨'
                            : job.status === 'pending_approval'
                            ? '승인 대기'
                            : '거절됨'}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-3 text-gray-700">
                        <div>
                          <span className="text-gray-500 font-medium">근무지:</span> {job.location}
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium">시급:</span> {job.wage_amount.toLocaleString()}원
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium">근무일:</span> {job.work_days}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">지원자 관리</h2>

              <div className="space-y-4">
                {myApplications.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>받은 지원이 없습니다.</p>
                  </div>
                ) : (
                  myApplications.map((app) => {
                    const job = jobPostings.find((j) => j.id === app.job_id);
                    return (
                      <div key={app.id} className="border border-gray-200 rounded-lg p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{app.senior_name}</h3>
                            <p className="text-gray-600">{job?.title}</p>
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
                              ? '승인됨'
                              : app.status === 'interview'
                              ? '면접 예정'
                              : app.status === 'rejected'
                              ? '거절됨'
                              : '검토중'}
                          </span>
                        </div>

                        {app.status === 'submitted' && (
                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={() => handleApplicationAction(app.id, 'approved', app.senior_id, app.job_id)}
                              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
                            >
                              승인 (채용)
                            </button>
                            <button
                              onClick={() => handleApplicationAction(app.id, 'interview', app.senior_id, app.job_id)}
                              className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-medium"
                            >
                              면접 예정
                            </button>
                            <button
                              onClick={() => handleApplicationAction(app.id, 'rejected', app.senior_id, app.job_id)}
                              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium"
                            >
                              거절
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Job Modal */}
      {showNewJobForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">새 공고 등록</h2>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">공고 제목</label>
                <input
                  type="text"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">업무 내용</label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">근무지</label>
                  <input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">고용형태</label>
                  <select
                    value={newJob.employment_type}
                    onChange={(e) => setNewJob({ ...newJob, employment_type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="시간제">시간제</option>
                    <option value="일용직">일용직</option>
                    <option value="계약직">계약직</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">시급 (원)</label>
                  <input
                    type="number"
                    value={newJob.wage_amount}
                    onChange={(e) => setNewJob({ ...newJob, wage_amount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">근무 기간</label>
                  <input
                    type="text"
                    value={newJob.work_period}
                    onChange={(e) => setNewJob({ ...newJob, work_period: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="예: 3개월"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">근무일</label>
                  <input
                    type="text"
                    value={newJob.work_days}
                    onChange={(e) => setNewJob({ ...newJob, work_days: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="예: 월, 수, 금"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">근무시간</label>
                  <input
                    type="text"
                    value={newJob.work_hours}
                    onChange={(e) => setNewJob({ ...newJob, work_hours: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="예: 09:00-14:00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">지원 마감일</label>
                <input
                  type="date"
                  value={newJob.deadline}
                  onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
                >
                  공고 등록
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewJobForm(false)}
                  className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
