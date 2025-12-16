import { useState } from "react";
import { ArrowLeft, User, Building2 } from "lucide-react";

const DAYS = [
  { key: "MON", label: "월" },
  { key: "TUE", label: "화" },
  { key: "WED", label: "수" },
  { key: "THU", label: "목" },
  { key: "FRI", label: "금" },
  { key: "SAT", label: "토" },
  { key: "SUN", label: "일" },
];

const JOB_TYPE_MAP = {
  both: "실내·실외 모두",
  office: "실내 업무",
  field: "실외 업무",
};

export default function SignUp({ role, onRegister, onBack }) {
  const [formData, setFormData] = useState({
    // 공통
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    
    // ✅ [추가 1] 생년월일, 성별 초기값 추가
    birthDate: "",
    gender: "male", // 기본값 '남성'

    // ✅ 사는 곳(주소) -> address
    address: "",

    // ✅ 시니어 선호조건
    jobType: "both",          
    workLocation: "",        
    restrictedActivities: "", 
    workDays: [],            
    workStartTime: "09:00",
    workEndTime: "18:00",    
    workPeriod: "",          

    // 기업
    businessNumber: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // workPeriod는 숫자만 허용
    if (name === "workPeriod") {
      if (value !== "" && !/^\d+$/.test(value)) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleDay = (dayKey) => {
    setFormData((prev) => {
      const exists = prev.workDays.includes(dayKey);
      const next = exists
        ? prev.workDays.filter((d) => d !== dayKey)
        : [...prev.workDays, dayKey];
      return { ...prev, workDays: next };
    });
    if (errors.workDays) setErrors((prev) => ({ ...prev, workDays: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username) newErrors.username = "아이디를 입력하세요";
    if (!formData.password) newErrors.password = "비밀번호를 입력하세요";
    if (!formData.confirmPassword) newErrors.confirmPassword = "비밀번호 확인을 입력하세요";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }
    if (!formData.name) newErrors.name = "이름을 입력하세요";
    if (!formData.phone) newErrors.phone = "전화번호를 입력하세요";

    // ✅ [추가 2] 생년월일 검증 (시니어일 경우만 필수 추천)
    if (role === "senior") {
        if (!formData.birthDate) newErrors.birthDate = "생년월일을 입력하세요";
    }

    if (!formData.address) newErrors.address = "사는 곳(주소)을 입력하세요";

    if (role === "company") {
      if (!formData.businessNumber) newErrors.businessNumber = "사업자번호를 입력하세요";
    }

    if (role === "senior") {
      if (!formData.workLocation) newErrors.workLocation = "선호 근무지역을 입력하세요";
      if (formData.workDays.length === 0) newErrors.workDays = "선호 근무요일을 선택하세요";
      if (!formData.workStartTime || !formData.workEndTime) newErrors.workHours = "근무시간을 선택하세요";
      if (!formData.workPeriod) newErrors.workPeriod = "근무기간(숫자)을 입력하세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (role === "senior") {
      const payload = {
        role: "senior",
        password: formData.password,
        
        id: formData.username,
        name: formData.name,
        phone: formData.phone,
        
        // ✅ [추가 3] DB 컬럼에 맞춰 데이터 추가
        birth_date: formData.birthDate, // 예: "1960-01-01"
        gender: formData.gender,        // "male" 또는 "female"

        address: formData.address,
        location: formData.workLocation,

        // 영어 값 그대로 보냄 ('office', 'field', 'both')
        employment_type: formData.jobType,
        restricted_activities: formData.restrictedActivities || null,

        work_days: formData.workDays.join(","),
        work_hours: `${formData.workStartTime}-${formData.workEndTime}`,
        work_period: Number(formData.workPeriod),
      };
      console.log("회원가입 payload", payload);
      onRegister(payload);
      return;
    }

    // 기업
    const companyPayload = {
      id: formData.username,
      username: formData.username,
      password: formData.password,
      role,
      name: formData.name,
      phone: formData.phone,
      businessNumber: formData.businessNumber,
      address: formData.address,
    };

    onRegister(companyPayload);
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
              {role === "senior" ? (
                <User className="w-10 h-10 text-white" />
              ) : (
                <Building2 className="w-10 h-10 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {role === "senior" ? "어르신 회원가입" : "기업 회원가입"}
            </h1>
            <p className="text-gray-500">정보를 입력하여 회원가입을 완료하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 아이디 */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">아이디</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="아이디를 입력하세요"
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">비밀번호</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="비밀번호를 입력하세요"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">비밀번호 확인</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="비밀번호를 다시 입력하세요"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* 이름 */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                {role === "senior" ? "이름" : "기업명"}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={role === "senior" ? "이름을 입력하세요" : "기업명을 입력하세요"}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* ✅ [추가 4] 생년월일과 성별 입력란 (시니어일 때만 표시) */}
            {role === "senior" && (
              <div className="grid md:grid-cols-2 gap-4">
                {/* 생년월일 */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">생년월일</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
                </div>

                {/* 성별 */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">성별</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                  </select>
                </div>
              </div>
            )}

            {/* 전화번호 */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">전화번호</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="010-0000-0000"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* 사는 곳(주소) */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">사는 곳(주소)</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 서울 강남구"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* 시니어 상세 정보 */}
            {role === "senior" && (
              <>
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">선호 근무 조건</h3>
                </div>

                {/* 선호 업무 유형 */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">선호 업무 유형</label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="both">실내·실외 모두</option>
                    <option value="office">실내 업무</option>
                    <option value="field">실외 업무</option>
                  </select>
                </div>

                {/* 선호 근무지역 */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">선호 근무지역</label>
                  <input
                    type="text"
                    name="workLocation"
                    value={formData.workLocation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 서울 강남구"
                  />
                  {errors.workLocation && (
                    <p className="text-red-500 text-sm mt-1">{errors.workLocation}</p>
                  )}
                </div>

                {/* 제한사항(선택) */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    제한사항(선택)
                  </label>
                  <input
                    type="text"
                    name="restrictedActivities"
                    value={formData.restrictedActivities}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 무거운 물건 X, 장시간 서있기 어려움 등"
                  />
                </div>

                {/* 선호 근무요일 */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">선호 근무요일</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((d) => {
                      const active = formData.workDays.includes(d.key);
                      return (
                        <button
                          type="button"
                          key={d.key}
                          onClick={() => toggleDay(d.key)}
                          className={`px-4 py-2 rounded-xl border transition ${
                            active
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                  {errors.workDays && <p className="text-red-500 text-sm mt-1">{errors.workDays}</p>}
                </div>

                {/* 희망 시간 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">희망 시작 시간</label>
                    <input
                      type="time"
                      name="workStartTime"
                      value={formData.workStartTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">희망 종료 시간</label>
                    <input
                      type="time"
                      name="workEndTime"
                      value={formData.workEndTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {errors.workHours && <p className="text-red-500 text-sm mt-1">{errors.workHours}</p>}

                {/* 근무기간 */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    근무기간(숫자만)
                  </label>
                  <input
                    type="text"
                    name="workPeriod"
                    value={formData.workPeriod}
                    onChange={handleChange}
                    inputMode="numeric"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 6 (개월) / 12 등"
                  />
                  {errors.workPeriod && <p className="text-red-500 text-sm mt-1">{errors.workPeriod}</p>}
                </div>
              </>
            )}

            {/* 기업 */}
            {role === "company" && (
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="000-00-00000"
                  />
                  {errors.businessNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessNumber}</p>
                  )}
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