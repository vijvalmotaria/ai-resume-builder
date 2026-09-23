import Resume from '../models/Resume.model.js';
import ResumeVersion from '../models/ResumeVersion.model.js';

export const saveVersion = async (resumeId, userId, label) => {
  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) {
    const err = new Error('Resume not found.');
    err.statusCode = 404;
    throw err;
  }

  // Get next version number
  const lastVersion = await ResumeVersion.findOne({ resumeId, userId })
    .sort({ versionNumber: -1 });
  const versionNumber = (lastVersion?.versionNumber || 0) + 1;

  const version = await ResumeVersion.create({
    resumeId,
    userId,
    versionNumber,
    label: label || `Version ${versionNumber}`,
    snapshot: resume.sections,
    template: resume.template,
  });

  return version;
};

export const getVersions = async (resumeId, userId) => {
  return ResumeVersion.find({ resumeId, userId })
    .sort({ versionNumber: -1 })
    .select('-snapshot');
};

export const getVersion = async (resumeId, userId, versionId) => {
  const version = await ResumeVersion.findOne({
    _id: versionId,
    resumeId,
    userId,
  });
  if (!version) {
    const err = new Error('Version not found.');
    err.statusCode = 404;
    throw err;
  }
  return version;
};

export const restoreVersion = async (resumeId, userId, versionId) => {
  const version = await ResumeVersion.findOne({
    _id: versionId,
    resumeId,
    userId,
  });
  if (!version) {
    const err = new Error('Version not found.');
    err.statusCode = 404;
    throw err;
  }

  const resume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    {
      sections: version.snapshot,
      template: version.template,
    },
    { new: true }
  );

  return resume;
};

export const deleteVersion = async (resumeId, userId, versionId) => {
  const version = await ResumeVersion.findOneAndDelete({
    _id: versionId,
    resumeId,
    userId,
  });
  if (!version) {
    const err = new Error('Version not found.');
    err.statusCode = 404;
    throw err;
  }
  return version;
};
