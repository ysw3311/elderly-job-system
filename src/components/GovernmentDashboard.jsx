import { useState } from 'react';
import { Shield, LogOut, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { api } from '../utils/api';

export default function GovernmentDashboard({ user, jobPostings, refreshData, onLogout }) {
  // 모달과 검토 의견을 관리하기 위한 State 추가
  const [selectedJob, setSelectedJob] = useState(null);
  const [reviewNote, setReviewNote] = useState('');

  // 공고 상태별 필터링
  const pendingJobs = jobPostings.filter((job) => job.status === 'pending_approval');
  const approvedJobs = jobPostings.filter((job) => job.status === 'approved');
  const rejectedJobs = jobPostings.filter((job) => job.status === 'rejected');

  // 승인 처리 핸들러
  const handleApprove = async (jobId) => {
    try {
      await api.updateJobStatus(jobId, 'approved');
      await refreshData(); // 목록 새로고침
      setSelectedJob(null); // 모달 닫기
      setReviewNote(''); // 입력창 초기화
      alert('공고가 승인되었습니다.');
    } catch (error) {
      console.error(error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  // 거절 처리 핸들러
  const handleReject = async (jobId) => {
    try {
      await api.updateJobStatus(jobId, 'rejected');
      await refreshData(); // 목록 새로고침
      setSelectedJob(null); // 모달 닫기
      setReviewNote(''); // 입력창 초기화
      alert('공고가 거절되었습니다.');
    } catch (error) {
      console.error(error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold text-white">정부 관리 시스템</h1>
                <p className="text-purple-100">{user.name}</p>
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
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">승인 대기</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{pendingJobs.length}건</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">승인 완료</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{approvedJobs.length}건</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-medium">승인 거절</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{rejectedJobs.length}건</p>
              </div>
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-yellow-500" />
            승인 대기 중인 공고
          </h2>

          {pendingJobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>승인 대기 중인 공고가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingJobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-200 rounded-lg p-5 hover:border-purple-300 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-gray-600">{job.company_name}</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      승인 대기
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
                      <span className="text-gray-500 font-medium">급여:</span> 시급 {job.wage_amount.toLocaleString()}원
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">근무일:</span> {job.work_days}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
                    {job.description}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-medium"
                    >
                      검토하기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approved Jobs */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            승인된 공고
          </h2>

          {approvedJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              승인된 공고가 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {approvedJobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-green-200 bg-green-50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                      <p className="text-gray-600">{job.company_name}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      승인 완료
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">공고 검토</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-1 font-medium">공고 제목</label>
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{selectedJob.title}</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">기업명</label>
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{selectedJob.company_name}</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">업무 내용</label>
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{selectedJob.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">근무지</label>
                  <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{selectedJob.location}</p>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">고용형태</label>
                  <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{selectedJob.employment_type}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">시급</label>
                  <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                    {selectedJob.wage_amount.toLocaleString()}원
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">근무일</label>
                  <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{selectedJob.work_days}</p>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">검토 의견 (선택사항)</label>
                <textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="검토 의견을 입력하세요"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleApprove(selectedJob.id)}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-medium"
              >
                <CheckCircle className="w-5 h-5" />
                승인
              </button>
              <button
                onClick={() => handleReject(selectedJob.id)}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 font-medium"
              >
                <XCircle className="w-5 h-5" />
                거절
              </button>
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setReviewNote('');
                }}
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