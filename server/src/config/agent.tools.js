import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import Resume from '../models/Resume.model.js';

// Factory function — creates tools with access to request context
export const createAgentTools = (context, aiService) => {
  // Tool 1: Update any resume section
  const updateResumeSectionTool = new DynamicStructuredTool({
    name: 'update_resume_section',
    description:
      'Update a specific section of the resume. Use this when the user provides information about their experience, education, skills, personal info, or any other resume section.',
    schema: z.object({
      section: z.enum([
        'personalInfo', 'summary', 'experience', 'education',
        'skills', 'projects', 'certifications',
      ]).describe('The resume section to update'),
      data: z.any().describe('The data to set for this section'),
    }),
    func: async ({ section, data }) => {
      try {
        const resume = await Resume.findOneAndUpdate(
          { _id: context.resumeId, userId: context.userId },
          { $set: { [`sections.${section}`]: data } },
          { new: true }
        );
        if (!resume) return 'Error: Resume not found.';
        return `Successfully updated ${section} section.`;
      } catch (err) {
        return `Error updating section: ${err.message}`;
      }
    },
  });

  // Tool 2: Generate STAR-method bullets
  const generateBulletsTool = new DynamicStructuredTool({
    name: 'generate_star_bullets',
    description:
      'Generate STAR-method bullet points for a work experience. Use this when the user describes their work experience or asks to improve bullets.',
    schema: z.object({
      role: z.string().describe('Job title'),
      company: z.string().describe('Company name'),
      rawExperience: z.string().describe('Raw description of what the user did'),
      targetRole: z.string().optional().describe('Target role for tailoring'),
    }),
    func: async ({ role, company, rawExperience, targetRole }) => {
      try {
        const result = await aiService.generateBullets({
          role, company, rawExperience, targetRole,
        });
        return JSON.stringify(result);
      } catch (err) {
        return `Error generating bullets: ${err.message}`;
      }
    },
  });

  // Tool 3: Get current resume data
  const getResumeTool = new DynamicStructuredTool({
    name: 'get_current_resume',
    description: 'Get the current state of the resume to review what sections are filled.',
    schema: z.object({}),
    func: async () => {
      try {
        const resume = await Resume.findOne({ _id: context.resumeId, userId: context.userId });
        if (!resume) return 'Resume not found.';
        return JSON.stringify(resume.sections, null, 2);
      } catch (err) {
        return `Error: ${err.message}`;
      }
    },
  });

  // Tool 4: Generate professional summary
  const generateSummaryTool = new DynamicStructuredTool({
    name: 'generate_summary',
    description: 'Generate a professional summary for the resume based on its current content.',
    schema: z.object({
      targetRole: z.string().optional().describe('Target role for tailoring'),
    }),
    func: async ({ targetRole }) => {
      try {
        const resume = await Resume.findOne({ _id: context.resumeId, userId: context.userId });
        if (!resume) return 'Resume not found.';
        const result = await aiService.generateSummary({
          sections: resume.sections,
          targetRole: targetRole || '',
        });
        if (result.summary) {
          await Resume.findByIdAndUpdate(context.resumeId, {
            $set: { 'sections.summary': result.summary },
          });
          return `Summary generated and saved: ${result.summary}`;
        }
        return JSON.stringify(result);
      } catch (err) {
        return `Error: ${err.message}`;
      }
    },
  });

  return [updateResumeSectionTool, generateBulletsTool, getResumeTool, generateSummaryTool];
};
