const ACTION_VERBS = new Set([
  'led', 'developed', 'designed', 'implemented', 'managed', 'created',
  'optimized', 'built', 'launched', 'reduced', 'increased', 'achieved',
  'delivered', 'collaborated', 'spearheaded', 'architected', 'streamlined',
  'automated', 'improved', 'established', 'mentored', 'drove', 'scaled',
  'transformed', 'pioneered', 'orchestrated', 'engineered', 'integrated',
  'accelerated', 'negotiated', 'resolved', 'migrated', 'deployed',
  'configured', 'analyzed', 'refactored', 'coordinated', 'facilitated',
]);

const checkFormatting = (sections) => {
  const issues = [];
  let score = 100;

  // Check personal info
  const pi = sections?.personalInfo || {};
  if (!pi.fullName) { issues.push('Missing full name'); score -= 15; }
  if (!pi.email) { issues.push('Missing email'); score -= 10; }
  if (!pi.phone) { issues.push('Missing phone'); score -= 5; }

  // Check summary
  if (!sections?.summary || sections.summary.length < 30) {
    issues.push('Summary too short or missing (aim for 50-150 words)');
    score -= 10;
  }

  // Check experience bullets
  const exp = sections?.experience || [];
  if (exp.length === 0) {
    issues.push('No work experience listed');
    score -= 15;
  }

  let totalBullets = 0;
  let actionVerbBullets = 0;
  let quantifiedBullets = 0;

  for (const job of exp) {
    const bullets = job.bullets || [];
    totalBullets += bullets.length;
    for (const b of bullets) {
      const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase();
      if (firstWord && ACTION_VERBS.has(firstWord)) actionVerbBullets++;
      if (/\d+%?|\$[\d,]+/.test(b)) quantifiedBullets++;
    }
  }

  // Check education
  if (!sections?.education || sections.education.length === 0) {
    issues.push('No education listed');
    score -= 10;
  }

  // Check skills
  const skills = sections?.skills || {};
  const totalSkills = (skills.technical?.length || 0) + (skills.soft?.length || 0);
  if (totalSkills < 3) {
    issues.push('Too few skills listed (aim for 8-15)');
    score -= 10;
  }

  return {
    score: Math.max(score, 0),
    issues,
    stats: {
      totalBullets,
      actionVerbBullets,
      quantifiedBullets,
      actionVerbPercentage: totalBullets ? Math.round((actionVerbBullets / totalBullets) * 100) : 0,
      quantifiedPercentage: totalBullets ? Math.round((quantifiedBullets / totalBullets) * 100) : 0,
    },
  };
};

export { checkFormatting, ACTION_VERBS };
