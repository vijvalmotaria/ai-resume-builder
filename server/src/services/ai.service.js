import { generateContent } from '../config/gemini.config.js';
import * as prompts from '../constants/prompts.js';
import { analyzeKeywords } from '../utils/keywordAnalyzer.js';
import { checkFormatting } from '../utils/formatChecker.js';
import { calculateWeightedScore } from '../utils/scoreCalculator.js';

// ---- JSON parse helper ----
const parseJsonResponse = (text) => {
  try { return JSON.parse(text); } catch (e) { /* continue */ }

  let jsonStr = null;
  if (text.includes('```json')) {
    const start = text.indexOf('```json') + 7;
    const end = text.indexOf('```', start);
    if (end > start) jsonStr = text.slice(start, end).trim();
  } else if (text.includes('{')) {
    const start = text.indexOf('{');
    let depth = 0;
    for (let i = start; i < text.length; i++) {
      if (text[i] === '{') depth++;
      else if (text[i] === '}') {
        depth--;
        if (depth === 0) { jsonStr = text.slice(start, i + 1); break; }
      }
    }
  }

  if (jsonStr) {
    try { return JSON.parse(jsonStr); } catch (e) { /* continue */ }
  }

  throw new Error('Failed to parse AI response as JSON');
};

// ---- Resume text builder ----
const buildResumeText = (sections) => {
  const parts = [];
  const pi = sections?.personalInfo;
  if (pi?.fullName) parts.push(`Name: ${pi.fullName}`);
  if (sections?.summary) parts.push(`Summary: ${sections.summary}`);

  const exp = sections?.experience || [];
  for (const e of exp) {
    parts.push(`${e.role} at ${e.company}`);
    if (e.bullets?.length) parts.push(e.bullets.join('\n'));
  }

  const skills = sections?.skills || {};
  for (const [category, list] of Object.entries(skills)) {
    if (Array.isArray(list) && list.length > 0) {
      const cleanName = category
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
      parts.push(`${cleanName}: ${list.join(', ')}`);
    }
  }

  const edu = sections?.education || [];
  for (const e of edu) {
    parts.push(`${e.degree} in ${e.field} from ${e.institution}`);
  }

  return parts.join('\n');
};

// ---- AI Service Functions ----

export const parseResume = async (rawText) => {
  const prompt = prompts.resumeParserPrompt(rawText);
  const response = await generateContent(prompt);
  return parseJsonResponse(response);
};

export const generateBullets = async (data) => {
  const prompt = prompts.bulletWriterPrompt(data);
  const response = await generateContent(prompt);
  return parseJsonResponse(response);
};

export const generateSummary = async (data) => {
  const prompt = prompts.summaryWriterPrompt(data);
  const response = await generateContent(prompt);
  return parseJsonResponse(response);
};

export const getAtsScore = async (sections, jobDescription) => {
  // Step 1: Algorithmic analysis
  const resumeText = buildResumeText(sections);
  const keywordAnalysis = analyzeKeywords(resumeText, jobDescription);
  const formatAnalysis = checkFormatting(sections);

  // Step 2: AI scoring with algorithmic context
  const prompt = prompts.atsScorePrompt({
    sections,
    jobDescription,
    algorithmicScores: {
      keywordMatch: keywordAnalysis.score,
      matched: keywordAnalysis.matched,
      missing: keywordAnalysis.missing,
      formatting: formatAnalysis.score,
      actionVerbPercentage: formatAnalysis.stats.actionVerbPercentage,
    },
  });

  const response = await generateContent(prompt);
  const aiResult = parseJsonResponse(response);

  // Step 3: Hybrid — average algorithmic + AI scores per metric
  const breakdown = {};
  const metrics = [
    'keywordMatch', 'bulletQuality', 'formatting', 'sectionCompleteness',
    'summaryStrength', 'skillCoverage', 'quantification', 'actionVerbs',
    'length', 'contactInfo',
  ];

  for (const metric of metrics) {
    const aiScore = aiResult.scores?.[metric]?.score ?? 50;
    if (metric === 'keywordMatch') {
      breakdown[metric] = Math.round((keywordAnalysis.score + aiScore) / 2);
    } else if (metric === 'formatting') {
      breakdown[metric] = Math.round((formatAnalysis.score + aiScore) / 2);
    } else {
      breakdown[metric] = aiScore;
    }
  }

  const overallScore = calculateWeightedScore(breakdown);

  return {
    overallScore,
    breakdown,
    aiScores: aiResult.scores,
    keywordAnalysis,
    formatAnalysis: formatAnalysis.issues,
    overallFeedback: aiResult.overallFeedback,
    topImprovements: aiResult.topImprovements || [],
  };
};

export const reviewResume = async (sections, targetRole) => {
  const prompt = prompts.reviewPrompt({ sections, targetRole });
  const response = await generateContent(prompt);
  return parseJsonResponse(response);
};

export const matchJob = async (sections, jobDescription) => {
  const prompt = prompts.matchJobPrompt({ sections, jobDescription });
  const response = await generateContent(prompt);
  return parseJsonResponse(response);
};

export const detectSkillGaps = async (skills, targetRole, jobDescription) => {
  const prompt = prompts.skillGapsPrompt({ skills, targetRole, jobDescription });
  const response = await generateContent(prompt);
  return parseJsonResponse(response);
};
