const STOP_WORDS = new Set([
  'a','an','the','and','or','but','is','are','was','were','be','been','being',
  'have','has','had','do','does','did','will','would','shall','should','may',
  'might','can','could','must','in','on','at','to','for','of','with','by',
  'from','as','into','through','during','before','after','above','below',
  'between','out','off','over','under','again','further','then','once','here',
  'there','when','where','why','how','all','both','each','few','more','most',
  'other','some','such','no','not','only','own','same','so','than','too',
  'very','just','about','also','this','that','these','those','it','its',
  'i','me','my','we','our','you','your','he','him','his','she','her',
  'they','them','their','what','which','who','whom',
]);

const extractKeywords = (text) => {
  if (!text) return [];
  const words = text.toLowerCase().replace(/[^a-z0-9\s\-+#.]/g, ' ').split(/\s+/);
  const freq = {};
  for (const w of words) {
    if (w.length > 2 && !STOP_WORDS.has(w)) {
      freq[w] = (freq[w] || 0) + 1;
    }
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);
};

const analyzeKeywords = (resumeText, jobDescription) => {
  if (!resumeText || !jobDescription) {
    return { score: 0, matched: [], missing: [], totalJdKeywords: 0 };
  }

  const resumeKeywords = new Set(extractKeywords(resumeText));
  const jdKeywords = extractKeywords(jobDescription);
  const topJdKeywords = jdKeywords.slice(0, 30);
  const total = topJdKeywords.length || 1;

  const matched = topJdKeywords.filter((k) => resumeKeywords.has(k));
  const missing = topJdKeywords.filter((k) => !resumeKeywords.has(k));

  return {
    score: Math.min(Math.round((matched.length / total) * 100), 100),
    matched: matched.slice(0, 20),
    missing: missing.slice(0, 15),
    totalJdKeywords: topJdKeywords.length,
  };
};

export { analyzeKeywords };
