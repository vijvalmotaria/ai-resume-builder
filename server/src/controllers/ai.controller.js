import * as aiService from '../services/ai.service.js';
import { chatWithAgent } from '../services/agent.service.js';
import ChatHistory from '../models/ChatHistory.model.js';
import Resume from '../models/Resume.model.js';

export const chat = async (req, res, next) => {
  try {
    const { resumeId, message, sectionTargeted } = req.body;
    if (!resumeId || !message) {
      return res.status(400).json({ success: false, message: 'resumeId and message are required.' });
    }

    // Verify resume belongs to user
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({
      resumeId, userId: req.user._id, agentType: 'interview',
    });
    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        resumeId, userId: req.user._id, agentType: 'interview', messages: [],
      });
    }

    // Save user message
    chatHistory.messages.push({ role: 'user', content: message });

    // Get AI response via agent
    const reply = await chatWithAgent(
      resumeId,
      req.user._id,
      message,
      chatHistory.messages.slice(-20) // last 20 messages for context
    );

    // Save AI response
    chatHistory.messages.push({ role: 'assistant', content: reply });
    await chatHistory.save();

    // Get updated resume
    const updatedResume = await Resume.findById(resumeId);

    return res.status(200).json({
      success: true,
      data: { reply, resume: updatedResume },
    });
  } catch (error) {
    next(error);
  }
};

export const getChatHistory = async (req, res, next) => {
  try {
    const chatHistory = await ChatHistory.findOne({
      resumeId: req.params.resumeId,
      userId: req.user._id,
      agentType: 'interview',
    });
    return res.status(200).json({
      success: true,
      data: chatHistory?.messages || [],
    });
  } catch (error) {
    next(error);
  }
};

export const generateBullets = async (req, res, next) => {
  try {
    const { role, company, rawExperience, targetRole, jobDescription } = req.body;
    if (!rawExperience) {
      return res.status(400).json({ success: false, message: 'rawExperience is required.' });
    }
    const result = await aiService.generateBullets({ role, company, rawExperience, targetRole, jobDescription });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const generateSummary = async (req, res, next) => {
  try {
    const { resumeId, targetRole } = req.body;
    if (!resumeId) {
      return res.status(400).json({ success: false, message: 'resumeId is required.' });
    }
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });

    const result = await aiService.generateSummary({ sections: resume.sections, targetRole });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const atsScore = async (req, res, next) => {
  try {
    const { resumeId, jobDescription } = req.body;
    if (!resumeId) {
      return res.status(400).json({ success: false, message: 'resumeId is required.' });
    }
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });

    const jd = (jobDescription && jobDescription.trim())
      ? jobDescription.trim()
      : (resume.lastJobDescription && resume.lastJobDescription.trim())
      ? resume.lastJobDescription.trim()
      : `${resume.title || 'Professional'} role with strong technical skills, quantifiable achievements, and proven industry impact.`;

    const result = await aiService.getAtsScore(resume.sections, jd);

    // Save scores to resume
    const flatBreakdown = {};
    for (const [key, val] of Object.entries(result.breakdown)) {
      flatBreakdown[key] = typeof val === 'object' ? val.score || val : val;
    }

    const updated = await Resume.findByIdAndUpdate(
      resumeId,
      {
        atsScore: result.overallScore,
        atsBreakdown: flatBreakdown,
        lastJobDescription: jd,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: {
        ...result,
        atsScore: result.overallScore,
        atsBreakdown: flatBreakdown,
        resume: updated,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const review = async (req, res, next) => {
  try {
    const { resumeId, targetRole } = req.body;
    if (!resumeId) {
      return res.status(400).json({ success: false, message: 'resumeId is required.' });
    }
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });

    const result = await aiService.reviewResume(resume.sections, targetRole);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const matchJob = async (req, res, next) => {
  try {
    const { resumeId, jobDescription } = req.body;
    if (!resumeId || !jobDescription) {
      return res.status(400).json({ success: false, message: 'resumeId and jobDescription are required.' });
    }
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });

    const result = await aiService.matchJob(resume.sections, jobDescription);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const skillGaps = async (req, res, next) => {
  try {
    const { resumeId, targetRole, jobDescription } = req.body;
    if (!resumeId || !targetRole) {
      return res.status(400).json({ success: false, message: 'resumeId and targetRole are required.' });
    }
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });

    const result = await aiService.detectSkillGaps(resume.sections.skills, targetRole, jobDescription);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
