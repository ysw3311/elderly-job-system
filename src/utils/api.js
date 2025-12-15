import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // 회원가입
  register: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  },

  // 로그인
  login: async (username, password) => {
    const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
    return response.data;
  },

  // 일자리 공고
  getJobs: async () => {
    const response = await axios.get(`${API_BASE_URL}/jobs`);
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await axios.post(`${API_BASE_URL}/jobs`, jobData);
    return response.data;
  },

  updateJobStatus: async (jobId, status) => {
    const response = await axios.put(`${API_BASE_URL}/jobs/${jobId}/status`, { status });
    return response.data;
  },

  // 지원
  getApplications: async () => {
    const response = await axios.get(`${API_BASE_URL}/applications`);
    return response.data;
  },

  createApplication: async (applicationData) => {
    const response = await axios.post(`${API_BASE_URL}/applications`, applicationData);
    return response.data;
  },

  updateApplicationStatus: async (appId, status) => {
    const response = await axios.put(`${API_BASE_URL}/applications/${appId}/status`, { status });
    return response.data;
  },

  // 이력
  getHistories: async () => {
    const response = await axios.get(`${API_BASE_URL}/histories`);
    return response.data;
  },

  // 시니어 프로필 조회
  getSeniorProfile: async (seniorId) => {
  const response = await axios.get(`${API_BASE_URL}/seniors/${seniorId}`);

  // ✅ success/profile 래핑이 있으면 profile만 꺼내줌
  return response.data.profile ?? response.data;
  },


  // 시니어 프로필 수정
  updateSeniorProfile: async (seniorId, profileData) => {
    const response = await axios.put(`${API_BASE_URL}/seniors/${seniorId}`, profileData);
    return response.data;
  },
};
