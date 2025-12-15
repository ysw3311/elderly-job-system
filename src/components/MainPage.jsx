import { Shield, Users, Building2, Briefcase, Heart, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react';

export default function MainPage({ onLogin, onSignUp }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-700 border-b-4 border-blue-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded">
                <Shield className="w-8 h-8 text-blue-700" />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">시니어 일자리 통합 지원 시스템</h1>
                <p className="text-blue-100 text-sm">고용노동부 · 노인일자리 지원센터</p>
              </div>
            </div>
            <button
              onClick={onLogin}
              className="bg-white text-blue-700 px-6 py-2 rounded font-medium hover:bg-blue-50 transition"
            >
              로그인
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">어르신을 위한 맞춤형 일자리</h2>
          <p className="text-gray-700 mb-8 text-xl max-w-3xl mx-auto leading-relaxed">
            정부가 검증한 안전한 일자리를 찾아드립니다.<br />
            여러분의 경험과 능력을 나눌 수 있는 기회를 제공합니다.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <button
              onClick={() => onSignUp('senior')}
              className="bg-blue-600 text-white px-10 py-5 rounded-xl hover:bg-blue-700 transition shadow-lg text-xl flex items-center gap-2 font-medium"
            >
              <Users className="w-6 h-6" />
              어르신 회원가입
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onSignUp('company')}
              className="bg-green-600 text-white px-10 py-5 rounded-xl hover:bg-green-700 transition shadow-lg text-xl flex items-center gap-2 font-medium"
            >
              <Building2 className="w-6 h-6" />
              기업 회원가입
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-blue-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur rounded-xl p-8 border border-white/20">
              <TrendingUp className="w-12 h-12 text-white mx-auto mb-4" />
              <p className="text-white text-5xl font-bold mb-2">2,450+</p>
              <p className="text-blue-100 text-xl">등록된 일자리</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-8 border border-white/20">
              <Users className="w-12 h-12 text-white mx-auto mb-4" />
              <p className="text-white text-5xl font-bold mb-2">8,320+</p>
              <p className="text-blue-100 text-xl">취업 성공</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-8 border border-white/20">
              <Building2 className="w-12 h-12 text-white mx-auto mb-4" />
              <p className="text-white text-5xl font-bold mb-2">1,200+</p>
              <p className="text-blue-100 text-xl">참여 기업</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-4xl font-bold text-gray-900 mb-4">시스템 이용 안내</h2>
          <p className="text-center text-gray-600 text-xl mb-16">간단하고 안전한 3단계 프로세스</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-gray-900 mb-4 text-2xl font-bold">회원가입</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                간단한 정보만 입력하시면<br />
                바로 이용하실 수 있습니다.<br />
                선호하는 일자리 조건도<br />
                함께 등록해주세요.
              </p>
            </div>

            <div className="bg-green-50 rounded-2xl p-8 border-2 border-green-200">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-gray-900 mb-4 text-2xl font-bold">일자리 찾기</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                정부가 승인한<br />
                검증된 일자리만 제공됩니다.<br />
                맞춤형 추천으로<br />
                적합한 일자리를 찾으세요.
              </p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-8 border-2 border-purple-200">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-gray-900 mb-4 text-2xl font-bold">지원 및 채용</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                클릭 한 번으로 지원하고<br />
                기업의 연락을 받으세요.<br />
                모든 이력은 자동으로<br />
                관리됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-4xl font-bold text-gray-900 mb-16">시스템 특징</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-md border-l-4 border-blue-600">
              <div className="flex items-start gap-4">
                <Shield className="w-12 h-12 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="text-gray-900 mb-3 text-xl font-bold">정부 승인 시스템</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    모든 일자리는 정부의 1차 검토를 거쳐 승인됩니다. 
                    불법적이거나 부적절한 공고는 사전에 차단되어 안전합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md border-l-4 border-green-600">
              <div className="flex items-start gap-4">
                <Heart className="w-12 h-12 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="text-gray-900 mb-3 text-xl font-bold">맞춤형 추천</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    회원가입 시 입력한 선호 조건을 바탕으로 
                    어르신께 적합한 일자리만 선별하여 추천해드립니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md border-l-4 border-purple-600">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-12 h-12 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="text-gray-900 mb-3 text-xl font-bold">자동 이력 관리</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    채용되면 자동으로 근무 이력이 등록됩니다. 
                    계약 종료 후에도 검증된 이력으로 영구 보관됩니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md border-l-4 border-orange-600">
              <div className="flex items-start gap-4">
                <Briefcase className="w-12 h-12 text-orange-600 flex-shrink-0" />
                <div>
                  <h3 className="text-gray-900 mb-3 text-xl font-bold">간편한 지원</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    복잡한 서류 없이 클릭 한 번으로 지원 가능합니다. 
                    지원 현황과 결과도 실시간으로 확인하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-white mb-6 text-4xl font-bold">지금 바로 시작하세요</h2>
          <p className="text-blue-100 text-xl mb-10 leading-relaxed">
            회원가입 후 바로 정부가 승인한 검증된 일자리를 확인하실 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onSignUp('senior')}
              className="bg-white text-blue-700 px-12 py-5 rounded-xl hover:bg-blue-50 transition shadow-lg text-xl font-medium"
            >
              어르신 회원가입 시작하기
            </button>
            <button
              onClick={() => onSignUp('company')}
              className="bg-green-600 text-white px-12 py-5 rounded-xl hover:bg-green-700 transition shadow-lg text-xl font-medium"
            >
              기업 회원가입 시작하기
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-xl mb-4 font-bold">시니어 일자리 지원 시스템</h4>
              <p className="text-gray-400 leading-relaxed">
                정부가 운영하는 공식 시니어 일자리 매칭 플랫폼입니다.
              </p>
            </div>
            <div>
              <h4 className="text-xl mb-4 font-bold">고객 지원</h4>
              <p className="text-gray-400">전화: 1577-0000</p>
              <p className="text-gray-400">운영시간: 평일 09:00-18:00</p>
            </div>
            <div>
              <h4 className="text-xl mb-4 font-bold">관련 기관</h4>
              <p className="text-gray-400">고용노동부</p>
              <p className="text-gray-400">노인일자리 지원센터</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>© 2025 시니어 일자리 통합 지원 시스템. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
