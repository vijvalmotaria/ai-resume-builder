import API from './api';

export const saveVersion = async (resumeId, label) => (await API.post(`/versions/${resumeId}`, { label })).data.data;
export const getVersions = async (resumeId) => (await API.get(`/versions/${resumeId}`)).data.data;
export const getVersion = async (resumeId, versionId) => (await API.get(`/versions/${resumeId}/${versionId}`)).data.data;
export const restoreVersion = async (resumeId, versionId) => (await API.post(`/versions/${resumeId}/${versionId}/restore`)).data.data;
export const deleteVersion = async (resumeId, versionId) => (await API.delete(`/versions/${resumeId}/${versionId}`)).data;
