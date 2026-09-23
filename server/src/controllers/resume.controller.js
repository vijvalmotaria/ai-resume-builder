import * as resumeService from '../services/resume.service.js';
import extractTextFromPdf from '../utils/resumeParser.js';
import * as aiService from '../services/ai.service.js';

export const createResume = async (req, res, next) => {
  try {
    const resume = await resumeService.createResume(req.user._id, req.body);
    return res.status(201).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

export const getResumes = async (req, res, next) => {
  try {
    const resumes = await resumeService.getResumes(req.user._id);
    return res.status(200).json({ success: true, data: resumes });
  } catch (error) {
    next(error);
  }
};

export const getResume = async (req, res, next) => {
  try {
    const resume = await resumeService.getResume(req.params.id, req.user._id);
    return res.status(200).json({ success: true, data: resume });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

export const updateResume = async (req, res, next) => {
  try {
    const resume = await resumeService.updateResume(req.params.id, req.user._id, req.body);
    return res.status(200).json({ success: true, data: resume });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

export const updateSection = async (req, res, next) => {
  try {
    const { section } = req.params;
    const validSections = ['personalInfo', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'];
    if (!validSections.includes(section)) {
      return res.status(400).json({ success: false, message: `Invalid section: ${section}` });
    }
    const resume = await resumeService.updateSection(req.params.id, req.user._id, section, req.body.data);
    return res.status(200).json({ success: true, data: resume });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

export const updateTemplate = async (req, res, next) => {
  try {
    const resume = await resumeService.updateTemplate(req.params.id, req.user._id, req.body.template);
    return res.status(200).json({ success: true, data: resume });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    await resumeService.deleteResume(req.params.id, req.user._id);
    return res.status(200).json({ success: true, message: 'Resume deleted.' });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No PDF file uploaded.' });
    }

    const rawText = await extractTextFromPdf(req.file.buffer);
    if (!rawText || rawText.length < 50) {
      return res.status(400).json({ success: false, message: 'Could not extract enough text from the PDF.' });
    }

    const parsed = await aiService.parseResume(rawText);
    const title = parsed.personalInfo?.fullName
      ? `${parsed.personalInfo.fullName}'s Resume`
      : 'Uploaded Resume';

    const resume = await resumeService.createResume(req.user._id, {
      title,
      sections: parsed,
    });

    return res.status(201).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};
