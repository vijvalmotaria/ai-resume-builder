import API from './api';

export const createResume = async (data) => (await API.post('/resumes', data)).data.data;
export const getResumes = async () => (await API.get('/resumes')).data.data;
export const getResume = async (id) => (await API.get(`/resumes/${id}`)).data.data;
export const updateResume = async (id, data) => (await API.put(`/resumes/${id}`, data)).data.data;
export const updateSection = async (id, section, data) => (await API.put(`/resumes/${id}/sections/${section}`, { data })).data.data;
export const updateTemplate = async (id, template) => (await API.put(`/resumes/${id}/template`, { template })).data.data;
export const deleteResume = async (id) => (await API.delete(`/resumes/${id}`)).data;

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return (await API.post('/resumes/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data.data;
};

export const uploadResumePdf = uploadResume;
