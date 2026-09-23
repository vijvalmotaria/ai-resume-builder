export const resumeParserPrompt = (rawText) => `You are an expert resume parser. Parse the following resume text into structured JSON.

RESUME TEXT:
${rawText}

Return JSON in this EXACT format:
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "portfolio": "",
    "github": ""
  },
  "summary": "",
  "experience": [
    {
      "company": "",
      "role": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "description": "",
      "bullets": [""],
      "location": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "startDate": "",
      "endDate": "",
      "gpa": "",
      "achievements": [""]
    }
  ],
  "skills": {
    "technical": [""],
    "soft": [""],
    "languages": [""]
  },
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": [""],
      "link": "",
      "startDate": "",
      "endDate": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "date": "",
      "link": ""
    }
  ]
}
Extract EVERYTHING you can find. Convert dates to YYYY-MM format. If information is missing, leave as empty string or empty array. Respond ONLY with valid JSON.`;

export const bulletWriterPrompt = (data) => `You are an expert resume writer specializing in STAR-method bullet points.

CONTEXT:
- Role: ${data.role || ''} at ${data.company || ''}
- Target position: ${data.targetRole || ''}
- Job Description Keywords: ${data.jobDescription || ''}

RAW EXPERIENCE:
${data.rawExperience || ''}

RULES:
1. Write 3-5 bullet points using STAR method (Situation-Task-Action-Result)
2. Start each bullet with a strong action verb
3. Include quantifiable metrics where possible (%, $, numbers)
4. Keep each bullet under 2 lines
5. Incorporate relevant keywords from the job description
6. Focus on impact and outcomes, not just responsibilities

Respond ONLY with valid JSON:
{
  "bullets": [
    "Led cross-functional team of 8 engineers to redesign authentication system, reducing login failures by 40% and improving user retention by 15%",
    "..."
  ]
}`;

export const summaryWriterPrompt = (data) => `You are a career counselor writing a professional summary.

RESUME DATA:
${JSON.stringify(data.sections, null, 2)}

TARGET ROLE: ${data.targetRole || 'Not specified'}

Write a compelling 3-4 sentence professional summary that:
1. Opens with years of experience and core expertise
2. Highlights 2-3 key achievements with metrics
3. Mentions relevant technical skills
4. Ends with career objective or value proposition

Respond ONLY with valid JSON:
{
  "summary": "Your professional summary here..."
}`;

export const atsScorePrompt = (data) => `You are an ATS (Applicant Tracking System) expert. Score this resume against the job description.

RESUME:
${JSON.stringify(data.sections, null, 2)}

JOB DESCRIPTION:
${data.jobDescription}

ALGORITHMIC PRE-ANALYSIS:
- Keyword Match Score: ${data.algorithmicScores?.keywordMatch || 0}/100
- Matched Keywords: ${data.algorithmicScores?.matched?.join(', ') || 'none'}
- Missing Keywords: ${data.algorithmicScores?.missing?.join(', ') || 'none'}
- Format Score: ${data.algorithmicScores?.formatting || 0}/100
- Action Verb Usage: ${data.algorithmicScores?.actionVerbPercentage || 0}%

Score each metric from 0-100. Be critical and specific with improvement suggestions.

Respond ONLY with valid JSON:
{
  "scores": {
    "keywordMatch": { "score": 0, "fix": "suggestion to improve" },
    "bulletQuality": { "score": 0, "fix": "" },
    "formatting": { "score": 0, "fix": "" },
    "sectionCompleteness": { "score": 0, "fix": "" },
    "summaryStrength": { "score": 0, "fix": "" },
    "skillCoverage": { "score": 0, "fix": "" },
    "quantification": { "score": 0, "fix": "" },
    "actionVerbs": { "score": 0, "fix": "" },
    "length": { "score": 0, "fix": "" },
    "contactInfo": { "score": 0, "fix": "" }
  },
  "overallFeedback": "2-3 sentences of overall assessment",
  "topImprovements": ["improvement 1", "improvement 2", "improvement 3"]
}`;

export const reviewPrompt = (data) => `You are a senior career counselor reviewing a resume.

RESUME:
${JSON.stringify(data.sections, null, 2)}

TARGET ROLE: ${data.targetRole || 'Not specified'}

Provide a comprehensive review covering:
1. Overall impression (strengths and weaknesses)
2. Content quality (relevance, impact, specificity)
3. Structure and organization
4. Language and tone
5. Specific actionable improvements

Respond ONLY with valid JSON:
{
  "overallScore": 75,
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "suggestions": [
    { "section": "experience", "priority": "high", "suggestion": "..." },
    { "section": "skills", "priority": "medium", "suggestion": "..." }
  ],
  "rewriteSuggestions": [
    { "original": "old text", "improved": "better text", "reason": "why" }
  ]
}`;

export const matchJobPrompt = (data) => `You are a job matching expert.

RESUME:
${JSON.stringify(data.sections, null, 2)}

JOB DESCRIPTION:
${data.jobDescription}

Analyze how well this resume matches the job. Respond ONLY with valid JSON:
{
  "matchScore": 75,
  "matchingSkills": ["skill 1", "skill 2"],
  "missingSkills": ["skill 1"],
  "matchingExperience": ["relevant experience 1"],
  "gaps": ["gap 1"],
  "tailoringTips": ["tip 1", "tip 2"]
}`;

export const skillGapsPrompt = (data) => `You are a career development advisor.

CURRENT SKILLS:
${JSON.stringify(data.skills, null, 2)}

TARGET ROLE: ${data.targetRole}
JOB DESCRIPTION: ${data.jobDescription || ''}

Identify skill gaps and learning paths. Respond ONLY with valid JSON:
{
  "gaps": [
    { "skill": "skill name", "importance": "critical", "currentLevel": "none", "resources": ["resource 1"] }
  ],
  "strengths": ["existing strong skill 1"],
  "learningPath": ["step 1", "step 2"]
}`;
