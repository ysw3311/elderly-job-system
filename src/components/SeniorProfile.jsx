import { useEffect, useMemo, useState } from 'react';
import {
  User,
  ArrowLeft,
  CheckCircle,
  Clock,
  Star,
  MapPin,
  Calendar,
  Save,
  Edit3,
  XCircle,
  Phone,
  Home,
  BadgeInfo,
  FileText,
  Briefcase,      
} from 'lucide-react';
import { api } from '../utils/api';

export default function SeniorProfile({
  user,                 // 로그인 유저 { id, name, role, ... }
  applications = [],    // 전체 applications
  employmentHistories = [], // 전체 histories
  refreshData,          // App.jsx에서 데이터 갱신 함수(선택)
  onBack,               // 대시보드로 돌아가기
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');

  const myApplications = useMemo(
    () => applications.filter((a) => a.senior_id === user.id),
    [applications, user.id]
  );

  const myHistories = useMemo(
    () => employmentHistories.filter((h) => h.senior_id === user.id),
    [employmentHistories, user.id]
  );

  const currentJob = useMemo(
    () => myHistories.find((h) => h.status === 'active'),
    [myHistories]
  );

  // 서버에서 받아온 프로필(원본)
  const [profile, setProfile] = useState(null);

  // 수정 폼 상태
  const [form, setForm] = useState({
    phone: '',
    birth_date: '', // 'YYYY-MM-DD'
    gender: '',
    address: '',
    restricted_activities: '',
    employment_type: '',
    location: '',
    work_days: '',
    work_hours: '',
    work_period: '',
  });

  const isProfileIncomplete = useMemo(() => {
    if (!profile) return true;
    // “회원가입만” 판단: 필수 프로필 필드 몇 개가 비었는지로 체크(원하는대로 조정 가능)
    const keysToCheck = ['birth_date', 'gender', 'address', 'employment_type', 'location'];
    return keysToCheck.some((k) => !profile[k]);
  }, [profile]);

  const setFormFromProfile = (p) => {
    setForm({
      phone: p.phone ?? '',
      birth_date: p.birth_date ?? '',
      gender: p.gender ?? '',
      address: p.address ?? '',
      restricted_activities: p.restricted_activities ?? '',
      employment_type: p.employment_type ?? '',
      location: p.location ?? '',
      work_days: p.work_days ?? '',
      work_hours: p.work_hours ?? '',
      work_period: p.work_period ?? '',
    });
  };

  // 프로필 조회
  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      // api.getSeniorProfile(id) 형태로 만들어두는 걸 추천.
      // 없으면 아래처럼 axios/fetch로 구현된 api 내부 함수에 맞춰 호출해줘.
      const data = await api.getSeniorProfile(user.id);
      setProfile(data);
      setFormFromProfile(data);
    } catch (e) {
      console.error(e);
      setError('프로필 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const loadProfile = async () => {
  try {
    console.log('[SeniorProfile] user.id =', user?.id);

    const res = await api.getSeniorProfile(user.id);

    console.log('[SeniorProfile] getSeniorProfile res =', res); 
    // res가 {success:true, profile:{...}} 인지
    // 아니면 그냥 {id:..., name:...} 인지 확인

    const profile = res.profile ?? res;  // 둘 다 대응(임시)
    console.log('[SeniorProfile] parsed profile =', profile);

    setProfile(profile);
  } catch (e) {
    console.error('[SeniorProfile] load failed', e?.response?.status, e?.response?.data || e);
    setError('프로필 정보를 불러오지 못했습니다.');
  }
};


  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCancelEdit = () => {
    if (profile) setFormFromProfile(profile);
    setEditMode(false);
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await api.updateSeniorProfile(user.id, form); // PUT /api/seniors/:id
      await fetchProfile(); // 저장 후 최신값 반영
      if (refreshData) await refreshData(); // 전체 데이터도 갱신하고 싶으면
      setEditMode(false);
      alert('프로필이 저장되었습니다.');
    } catch (e) {
      console.error(e);
      setError('저장 중 오류가 발생했습니다. 입력값을 확인해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const formatOrDash = (v) => (v ? v : '미입력');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Dashboard와 동일 톤 */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold text-white">시니어 프로필</h1>
                <p className="text-blue-100">{user.name}님 정보</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                대시보드
              </button>

              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-medium"
                  disabled={loading}
                >
                  <Edit3 className="w-5 h-5" />
                  수정하기
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-500/90 hover:bg-green-500 px-4 py-2 rounded-lg transition font-medium"
                    disabled={saving}
                  >
                    <Save className="w-5 h-5" />
                    {saving ? '저장중...' : '저장'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-medium"
                    disabled={saving}
                  >
                    <XCircle className="w-5 h-5" />
                    취소
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 로딩/에러 */}
        {loading && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600">프로필 정보를 불러오는 중...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 flex items-start gap-3">
            <XCircle className="w-6 h-6 text-red-600 mt-0.5" />
            <div className="text-red-700 font-medium">{error}</div>
          </div>
        )}

        {!loading && profile && (
          <>
            {/* Current Job Alert - Dashboard와 동일 UX */}
            {currentJob ? (
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
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <Clock className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-blue-900 mb-2">현재 구직중입니다</h3>
                    <p className="text-blue-800 text-sm">
                      프로필을 작성하면 더 정확한 추천을 받을 수 있어요.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 프로필 미작성 알림 */}
            {isProfileIncomplete && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <BadgeInfo className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-yellow-900 mb-1">프로필이 완성되지 않았습니다</h3>
                    <p className="text-yellow-800 text-sm">
                      주소/성별/생년월일/선호 조건 등을 입력하면 추천 정확도가 올라갑니다.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats - Dashboard 스타일 그대로 */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 font-medium">지원 내역</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{myApplications.length}건</p>
                  </div>
                  <FileText className="w-10 h-10 text-blue-500" />
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

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 font-medium">프로필 상태</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {isProfileIncomplete ? '미완성' : '완성'}
                    </p>
                  </div>
                  <User className="w-10 h-10 text-purple-500" />
                </div>
              </div>
            </div>

            {/* 메인 카드 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">기본 정보</h2>
                {!editMode && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isProfileIncomplete ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {isProfileIncomplete ? '프로필 미완성' : '프로필 완성'}
                  </span>
                )}
              </div>

              {/* Avatar + 기본 */}
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-3xl font-bold">
                    {user.name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{profile.name}</p>
                  <p className="text-gray-600">ID: {profile.id}</p>
                </div>
              </div>

              {/* Fields */}
              <div className="grid md:grid-cols-2 gap-5">
                {/* phone */}
                <Field
                  icon={<Phone className="w-5 h-5 text-blue-600" />}
                  label="전화번호"
                  value={editMode ? (
                    <input
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="010-0000-0000"
                    />
                  ) : (
                    formatOrDash(profile.phone)
                  )}
                />

                {/* birth_date */}
                <Field
                  icon={<Calendar className="w-5 h-5 text-purple-600" />}
                  label="생년월일"
                  value={editMode ? (
                    <input
                      type="date"
                      value={form.birth_date}
                      onChange={(e) => handleChange('birth_date', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    formatOrDash(profile.birth_date)
                  )}
                />

                {/* gender */}
                <Field
                  icon={<User className="w-5 h-5 text-indigo-600" />}
                  label="성별"
                  value={editMode ? (
                    <select
                      value={form.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">선택</option>
                      <option value="male">남성</option>
                      <option value="female">여성</option>
                    </select>
                  ) : (
                    formatOrDash(profile.gender === 'male' ? '남성' : profile.gender === 'female' ? '여성' : profile.gender)
                  )}
                />

                {/* address */}
                <Field
                  icon={<Home className="w-5 h-5 text-green-600" />}
                  label="주소"
                  value={editMode ? (
                    <input
                      value={form.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="예: 서울 강남구"
                    />
                  ) : (
                    formatOrDash(profile.address)
                  )}
                />
              </div>

              {/* 선호 조건 카드 */}
              <div className="mt-10">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  선호 근무 조건
                </h3>

                <div className="grid md:grid-cols-2 gap-5">
                  <Field
                    icon={<MapPin className="w-5 h-5 text-blue-600" />}
                    label="선호 근무지"
                    value={editMode ? (
                      <input
                        value={form.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 서울 강남구"
                      />
                    ) : (
                      formatOrDash(profile.location)
                    )}
                  />

                  <Field
                    icon={<Briefcase className="w-5 h-5 text-green-600" />}
                    label="고용 형태"
                    value={editMode ? (
                      <input
                        value={form.employment_type}
                        onChange={(e) => handleChange('employment_type', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 시간제 / 일용직"
                      />
                    ) : (
                      formatOrDash(profile.employment_type)
                    )}
                  />

                  <Field
                    icon={<Calendar className="w-5 h-5 text-purple-600" />}
                    label="근무일"
                    value={editMode ? (
                      <input
                        value={form.work_days}
                        onChange={(e) => handleChange('work_days', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 월~금"
                      />
                    ) : (
                      formatOrDash(profile.work_days)
                    )}
                  />

                  <Field
                    icon={<Clock className="w-5 h-5 text-indigo-600" />}
                    label="근무시간"
                    value={editMode ? (
                      <input
                        value={form.work_hours}
                        onChange={(e) => handleChange('work_hours', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 09:00~13:00"
                      />
                    ) : (
                      formatOrDash(profile.work_hours)
                    )}
                  />

                  <div className="md:col-span-2">
                    <Field
                      icon={<Clock className="w-5 h-5 text-gray-600" />}
                      label="근무기간"
                      value={editMode ? (
                        <input
                          value={form.work_period}
                          onChange={(e) => handleChange('work_period', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="예: 3개월 / 6개월"
                        />
                      ) : (
                        formatOrDash(profile.work_period)
                      )}
                    />
                  </div>
                </div>

                {/* 제한 업무 */}
                <div className="mt-6">
                  <label className="block text-gray-600 mb-2 font-medium flex items-center gap-2">
                    <BadgeInfo className="w-5 h-5 text-amber-600" />
                    제한 업무(선택)
                  </label>

                  {editMode ? (
                    <textarea
                      value={form.restricted_activities}
                      onChange={(e) => handleChange('restricted_activities', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="예: 야간 근무 불가, 무거운 물건 운반 불가"
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-xl text-gray-800">
                      {formatOrDash(profile.restricted_activities)}
                    </div>
                  )}
                </div>
              </div>

              {/* editMode일 때 하단 액션 */}
              {editMode && (
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-60"
                  >
                    {saving ? '저장중...' : '저장하기'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-60"
                  >
                    취소
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** 공통 Field UI (대시보드 카드 스타일 유지) */
function Field({ icon, label, value }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-gray-700 font-medium">{label}</p>
      </div>
      <div className="text-gray-900">{value}</div>
    </div>
  );
}
