import mongoose from 'mongoose';
import Resume from '../models/Resume.model.js';

// Strip invalid _id fields from subdocument arrays before saving
const sanitizeSections = (sections) => {
  if (!sections) return sections;
  const cleaned = { ...sections };
  const arrayFields = ['experience', 'education', 'projects', 'certifications'];

  for (const field of arrayFields) {
    if (Array.isArray(cleaned[field])) {
      cleaned[field] = cleaned[field].map((item) => {
        const copy = { ...item };
        if (copy._id && !mongoose.Types.ObjectId.isValid(copy._id)) {
          delete copy._id;
        }
        return copy;
      });
    }
  }
  return cleaned;
};

export const createResume = async (userId, data = {}) => {
  const resume = await Resume.create({
    userId,
    title: data.title || 'Untitled Resume',
    template: data.template || 'classic',
    sections: sanitizeSections(data.sections) || {},
  });
  return resume;
};

export const getResumes = async (userId) => {
  return Resume.find({ userId }).sort({ updatedAt: -1 }).select('-__v');
};

export const getResume = async (resumeId, userId) => {
  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) {
    const err = new Error('Resume not found.');
    err.statusCode = 404;
    throw err;
  }
  return resume;
};

export const updateResume = async (resumeId, userId, data) => {
  const updateData = { ...data };
  if (updateData.sections) {
    updateData.sections = sanitizeSections(updateData.sections);
  }

  const resume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    updateData,
    { new: true, runValidators: true }
  );
  if (!resume) {
    const err = new Error('Resume not found.');
    err.statusCode = 404;
    throw err;
  }
  return resume;
};

export const updateSection = async (resumeId, userId, sectionName, sectionData) => {
  const validSections = [
    'personalInfo', 'summary', 'experience', 'education',
    'skills', 'projects', 'certifications',
  ];
  if (!validSections.includes(sectionName)) {
    const err = new Error(`Invalid section: ${sectionName}`);
    err.statusCode = 400;
    throw err;
  }

  let data = sectionData;
  if (Array.isArray(data)) {
    data = data.map((item) => {
      const copy = { ...item };
      if (copy._id && !mongoose.Types.ObjectId.isValid(copy._id)) delete copy._id;
      return copy;
    });
  }

  const resume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    { $set: { [`sections.${sectionName}`]: data } },
    { new: true, runValidators: true }
  );
  if (!resume) {
    const err = new Error('Resume not found.');
    err.statusCode = 404;
    throw err;
  }
  return resume;
};

export const updateTemplate = async (resumeId, userId, template) => {
  const resume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    { template },
    { new: true, runValidators: true }
  );
  if (!resume) {
    const err = new Error('Resume not found.');
    err.statusCode = 404;
    throw err;
  }
  return resume;
};

export const deleteResume = async (resumeId, userId) => {
  const resume = await Resume.findOneAndDelete({ _id: resumeId, userId });
  if (!resume) {
    const err = new Error('Resume not found.');
    err.statusCode = 404;
    throw err;
  }
  return resume;
};
