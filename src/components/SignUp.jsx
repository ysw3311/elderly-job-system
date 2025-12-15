import { useState } from 'react';
import { ArrowLeft, User, Building2 } from 'lucide-react';

export default function SignUp({ role, onRegister, onBack }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    // 시니어 선호 조건
    jobType: 'both',
    workStartTime: '09:00',
    workEndTime: '18:00',
    workLocation: '',
    // 기업 정보
    businessNumber: '',
    address: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 에러 초기화
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username) newErrors.username = '아이디를 입력하세요';
    if (!formData.password) newErrors.password = '비밀번호를 입력하세요';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }
    if (!formData.name) newErrors.name = '이름을 입력하세요';
    if (!formData.phone) newErrors.phone = '전화번호를 입력하세요';

    if (role === 'company') {
      if (!formData.businessNumber) newErrors.businessNumber = '사업자번호를 입력하세요';
      if (!formData.address) newErrors.address = '주소를 입력하세요';
    }

    if (role === 'senior') {
      if (!formData.workLocation) newErrors.workLocation = '희망 근무지를 입력하세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    const userData = {
      id: `${role}_${Date.now()}`,
      username: formData.username,
      password: formData.password,
      role: role,
      name: formData.name,
      phone: formData.phone,
    };

    if (role === 'senior') {
      userData.preferences = {
        jobType: formData.jobType,
        workStartTime: formData.workStartTime,
        workEndTime: formData.workEndTime,
        workLocation: formData.workLocation,
      };
    }

    if (role === 'company') {
      userData.companyInfo = {
        businessNumber: formData.businessNumber,
        address: formData.address,
      };
    }

    onRegister(userData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition mb-4 text-lg font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          뒤로 가기
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              {role === 'senior' ? (
                <User className="w-10 h-10 text-white" />
              ) : (
                <Building2 className="w-10 h-10 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {role === 'senior' ? '어르신 회원가입' : '기업 회원가입'}
            </h1>
            <p className="text-gray-500">정보를 입력하여 회원가입을 완료하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">아이디</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="아이디를 입력하세요"
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">비밀번호</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="비밀번호를 입력하세요"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">비밀번호 확인</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="비밀번호를 다시 입력하세요"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                {role === 'senior' ? '이름' : '기업명'}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder={role === 'senior' ? '이름을 입력하세요' : '기업명을 입력하세요'}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">전화번호</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="010-0000-0000"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* 시니어 선호 조건 */}
            {role === 'senior' && (
              <>
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">선호 근무 조건</h3>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">선호 업무 유형</label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="both">실내·실외 모두</option>
                    <option value="office">실내 업무</option>
                    <option value="field">실외 업무</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">희망 시작 시간</label>
                    <input
                      type="time"
                      name="workStartTime"
                      value={formData.workStartTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">희망 종료 시간</label>
                    <input
                      type="time"
                      name="workEndTime"
                      value={formData.workEndTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">희망 근무지</label>
                  <input
                    type="text"
                    name="workLocation"
                    value={formData.workLocation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="예: 서울 강남구"
                  />
                  {errors.workLocation && <p className="text-red-500 text-sm mt-1">{errors.workLocation}</p>}
                </div>
              </>
            )}

            {/* 기업 정보 */}
            {role === 'company' && (
              <>
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">기업 정보</h3>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">사업자번호</label>
                  <input
                    type="text"
                    name="businessNumber"
                    value={formData.businessNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="000-00-00000"
                  />
                  {errors.businessNumber && <p className="text-red-500 text-sm mt-1">{errors.businessNumber}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">주소</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="주소를 입력하세요"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl text-lg font-medium"
            >
              회원가입 완료
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
