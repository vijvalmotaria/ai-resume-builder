import API from './api';

export const chat = async (resumeId, message) => (await API.post('/ai/chat', { resumeId, message })).data.data;
export const chatWithAi = chat;

export const getChatHistory = async (resumeId) => (await API.get(`/ai/chat-history/${resumeId}`)).data.data;

export const generateBullets = async (data) => {
  const payload = {
    role: data.role || '',
    company: data.company || '',
    rawExperience: data.description || data.rawExperience || data.role || '',
    targetRole: data.targetRole || data.role || '',
    jobDescription: data.jobDescription || '',
  };
  return (await API.post('/ai/generate-bullets', payload)).data.data;
};

export const generateSummary = async (params) => {
  const payload = typeof params === 'object' && params?.resumeId
    ? params
    : typeof params === 'string'
    ? { resumeId: params }
    : { resumeId: params?.resume?._id || params?.resumeId };
  return (await API.post('/ai/generate-summary', payload)).data.data;
};

export const getAtsScore = async (payload) => {
  const resumeId = typeof payload === 'string' ? payload : payload?.resumeId;
  const jobDescription = (typeof payload === 'object' ? payload?.jobDescription : '') || 'Software Engineer or Professional role matching key skills';
  return (await API.post('/ai/ats-score', { resumeId, jobDescription })).data.data;
};
export const calculateAtsScore = getAtsScore;

export const reviewResume = async (payload) => {
  const resumeId = typeof payload === 'string' ? payload : payload?.resumeId;
  const targetRole = (typeof payload === 'object' ? payload?.targetRole : '') || 'Professional';
  return (await API.post('/ai/review', { resumeId, targetRole })).data.data;
};
export const getAiReview = reviewResume;

export const matchJob = async (resumeId, jobDescription) => (await API.post('/ai/match-job', { resumeId, jobDescription })).data.data;
export const matchJobDescription = matchJob;

export const detectSkillGaps = async (resumeId, targetRole, jobDescription) => (await API.post('/ai/skill-gaps', { resumeId, targetRole, jobDescription })).data.data;
