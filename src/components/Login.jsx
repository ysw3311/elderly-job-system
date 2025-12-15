import { useState } from 'react';
import { Shield, ArrowLeft, Building2, User } from 'lucide-react';
import { api } from '../utils/api';

// 데모 계정 데이터 정의
const DEMO_ACCOUNTS = [
  { id: 'gov_001', username: 'gov_admin', password: 'gov123', role: 'government', name: '정부 관리자' },
  { id: 'company_001', username: 'company_samsung', password: 'comp123', role: 'company', name: '삼성전자' },
  { id: 'company_002', username: 'company_hyundai', password: 'comp123', role: 'company', name: '현대백화점' },
  { id: 'senior_001', username: 'senior_kim', password: 'senior123', role: 'senior', name: '김영희' },
  { id: 'senior_002', username: 'senior_park', password: 'senior123', role: 'senior', name: '박철수' },
];

export default function Login({ onLogin, onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // 디자인을 위해 필요한 상태 추가
  const [showAccounts, setShowAccounts] = useState(false);

  // 일반 로그인 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.login(username, password);
      if (response.success) {
        onLogin(response.user);
      }
    } catch (err) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  // 데모 계정 클릭 시 처리
  const handleQuickLogin = async (account) => {
    // 1. 폼에 자동으로 입력해줌 (시각적 효과)
    setUsername(account.username);
    setPassword(account.password);
    setError('');

    // 2. 실제 API로 로그인 시도
    try {
      const response = await api.login(account.username, account.password);
      if (response.success) {
        onLogin(response.user);
      }
    } catch (err) {
      // DB에 없는 계정일 경우 에러 메시지와 함께 안내
      setError(`DB에 '${account.username}' 계정이 없습니다. 회원가입을 먼저 진행해주세요.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition mb-4 text-lg font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          메인으로 돌아가기
        </button>
        
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Side - Login Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">로그인</h1>
              <p className="text-gray-500">시니어 일자리 매칭 시스템</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-gray-700 mb-2 font-medium">
                  아이디
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="아이디를 입력하세요"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl font-medium"
              >
                로그인
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowAccounts(!showAccounts)}
                className="w-full text-blue-600 hover:text-blue-700 py-2 text-center transition font-medium"
              >
                {showAccounts ? '데모 계정 숨기기' : '데모 계정 보기'}
              </button>
            </div>
          </div>

          {/* Right Side - Demo Accounts */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">시스템 소개</h2>
              <div className="space-y-3 text-gray-600">
                <p>• 기업이 정부에 일자리 공고 승인 요청</p>
                <p>• 정부가 공고를 검토하고 승인/거절</p>
                <p>• 노인이 승인된 공고를 확인하고 지원</p>
                <p>• 기업이 지원자를 관리 (승인/면접/거절)</p>
                <p>• 승인시 자동으로 이력관리에 등록</p>
                <p>• 계약 종료시 이력에 기록 유지</p>
              </div>
            </div>

            {showAccounts && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">데모 계정 목록</h3>
                <div className="space-y-3">
                  {/* Government Account */}
                  <div className="border border-purple-200 rounded-xl p-4 bg-purple-50">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                      <span className="text-purple-900 font-bold">정부 관리자</span>
                    </div>
                    <div className="text-gray-600 space-y-1 mb-3 text-sm">
                      <p>ID: gov_admin</p>
                      <p>PW: gov123</p>
                    </div>
                    <button
                      onClick={() => handleQuickLogin(DEMO_ACCOUNTS[0])}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-medium"
                    >
                      정부로 로그인
                    </button>
                  </div>

                  {/* Company Accounts */}
                  <div className="border border-green-200 rounded-xl p-4 bg-green-50">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="w-5 h-5 text-green-600" />
                      <span className="text-green-900 font-bold">기업 계정</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-gray-600 text-sm">
                        <p className="font-medium">삼성전자</p>
                        <p className="text-xs">ID: company_samsung / PW: comp123</p>
                        <button
                          onClick={() => handleQuickLogin(DEMO_ACCOUNTS[1])}
                          className="w-full mt-2 bg-green-600 text-white py-1.5 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                        >
                          삼성전자로 로그인
                        </button>
                      </div>
                      <div className="text-gray-600 pt-2 border-t border-green-200 text-sm">
                        <p className="font-medium">현대백화점</p>
                        <p className="text-xs">ID: company_hyundai / PW: comp123</p>
                        <button
                          onClick={() => handleQuickLogin(DEMO_ACCOUNTS[2])}
                          className="w-full mt-2 bg-green-600 text-white py-1.5 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                        >
                          현대백화점으로 로그인
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Senior Accounts */}
                  <div className="border border-blue-200 rounded-xl p-4 bg-blue-50">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-900 font-bold">노인 회원</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-gray-600 text-sm">
                        <p className="font-medium">김영희 (근무중)</p>
                        <p className="text-xs">ID: senior_kim / PW: senior123</p>
                        <button
                          onClick={() => handleQuickLogin(DEMO_ACCOUNTS[3])}
                          className="w-full mt-2 bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                          김영희로 로그인
                        </button>
                      </div>
                      <div className="text-gray-600 pt-2 border-t border-blue-200 text-sm">
                        <p className="font-medium">박철수 (구직중)</p>
                        <p className="text-xs">ID: senior_park / PW: senior123</p>
                        <button
                          onClick={() => handleQuickLogin(DEMO_ACCOUNTS[4])}
                          className="w-full mt-2 bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                          박철수로 로그인
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}