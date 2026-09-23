const WEIGHTS = {
  keywordMatch: 0.20,
  bulletQuality: 0.15,
  formatting: 0.10,
  sectionCompleteness: 0.10,
  summaryStrength: 0.10,
  skillCoverage: 0.10,
  quantification: 0.10,
  actionVerbs: 0.05,
  length: 0.05,
  contactInfo: 0.05,
};

const calculateWeightedScore = (breakdown) => {
  let total = 0;
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    total += (breakdown[key] || 0) * weight;
  }
  return Math.round(total);
};

const getScoreCategory = (score) => {
  if (score >= 85) return { label: 'Excellent', color: 'green' };
  if (score >= 70) return { label: 'Good', color: 'blue' };
  if (score >= 50) return { label: 'Needs Work', color: 'yellow' };
  return { label: 'Poor', color: 'red' };
};

export { calculateWeightedScore, getScoreCategory, WEIGHTS };
