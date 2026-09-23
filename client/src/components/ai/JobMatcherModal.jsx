import React, { useState } from 'react';
import { X, Target, CheckCircle2, AlertCircle, Sparkles, Loader2, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { matchJobDescription } from '../../services/ai.service';

export default function JobMatcherModal({ isOpen, onClose, resumeId, initialJobDescription = '', onMatchComplete }) {
  const [jobDescription, setJobDescription] = useState(initialJobDescription);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [copiedKeyword, setCopiedKeyword] = useState(null);

  if (!isOpen) return null;

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description first');
      return;
    }

    setLoading(true);
    try {
      const data = await matchJobDescription(resumeId, jobDescription);
      setResults(data);
      toast.success(`Analysis complete! Match score: ${data.matchPercentage || data.score || 0}%`);
      if (onMatchComplete) onMatchComplete(data, jobDescription);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to analyze job match');
    } finally {
      setLoading(false);
    }
  };

  const copyKeyword = (keyword) => {
    navigator.clipboard.writeText(keyword);
    setCopiedKeyword(keyword);
    toast.success(`Copied "${keyword}"`);
    setTimeout(() => setCopiedKeyword(null), 1500);
  };

  const matchPercent = results?.matchPercentage ?? results?.score ?? null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Job Description Keyword Matcher</h2>
              <p className="text-[11px] text-slate-500">Compare your resume against real ATS job requirements</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Paste Target Job Description (Requirements, Responsibilities, Skills)
            </label>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job posting text here..."
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleMatch}
              disabled={loading || !jobDescription.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Analyzing with ATS Engine...' : 'Scan & Compare Match'}
            </button>
          </div>

          {/* Results view */}
          {results && (
            <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              {/* Match Score Indicator */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold block">
                    ATS Keyword Compatibility
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">
                    {matchPercent >= 80
                      ? 'Excellent alignment! Your resume matches the key criteria for this job.'
                      : matchPercent >= 60
                      ? 'Good baseline. Add the missing keywords below to pass the automated filter.'
                      : 'Low alignment. We strongly recommend tailoring your bullet points and skills.'}
                  </p>
                </div>
                <div className="text-center pl-4 border-l border-indigo-200 dark:border-indigo-800">
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{matchPercent}%</span>
                  <span className="text-[10px] block text-slate-500 font-bold uppercase">Match</span>
                </div>
              </div>

              {/* Matched Keywords */}
              {results.matchedKeywords?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4" /> Matched Keywords ({results.matchedKeywords.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {results.matchedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px]"
                      >
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Keywords */}
              {results.missingKeywords?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mb-2">
                    <AlertCircle className="w-4 h-4" /> Missing Keywords to Add ({results.missingKeywords.length})
                  </h3>
                  <p className="text-[11px] text-slate-500 mb-2">Click any keyword to copy and paste it into your skills or bullet points:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {results.missingKeywords.map((kw, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => copyKeyword(kw)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition cursor-pointer text-[11px]"
                        title="Click to copy"
                      >
                        {copiedKeyword === kw ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Tailoring Suggestions */}
              {results.recommendations?.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">AI Strategic Recommendations:</span>
                  <ul className="list-disc ml-4 space-y-1 text-slate-600 dark:text-slate-400 text-[11.5px]">
                    {results.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
