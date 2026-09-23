import React, { useState } from 'react';
import { Gauge, CheckCircle, AlertTriangle, XCircle, RefreshCw, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { calculateAtsScore, getAiReview } from '../../services/ai.service';

export default function AtsScoreCard({ resume, onScoreUpdated }) {
  const [loading, setLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(true);

  const score = resume?.atsScore ?? 0;
  const breakdown = resume?.atsBreakdown || {};

  const getScoreColor = (val) => {
    if (val >= 80) return 'text-emerald-500 stroke-emerald-500';
    if (val >= 60) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  const getScoreBg = (val) => {
    if (val >= 80) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    if (val >= 60) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  };

  const handleRecalculate = async () => {
    if (!resume?._id) return;
    setLoading(true);
    try {
      const res = await calculateAtsScore({
        resumeId: resume._id,
        jobDescription: resume.lastJobDescription || '',
      });

      const newScore = res?.atsScore ?? res?.overallScore;
      const newBreakdown = res?.atsBreakdown ?? res?.breakdown;

      if (newScore !== undefined) {
        toast.success(`ATS Score updated: ${newScore}/100!`);
        if (onScoreUpdated) {
          onScoreUpdated({
            atsScore: newScore,
            atsBreakdown: newBreakdown || {},
            ...res,
          });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to calculate ATS score');
    } finally {
      setLoading(false);
    }
  };

  const handleDeepReview = async () => {
    if (!resume?._id) return;
    setReviewLoading(true);
    try {
      const res = await getAiReview({
        resumeId: resume._id,
        jobDescription: resume.lastJobDescription || '',
      });

      if (res) {
        setReviewData(res);
        toast.success('AI deep review complete!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to run AI deep review');
    } finally {
      setReviewLoading(false);
    }
  };

  const metrics = [
    { label: 'Keywords Match', value: breakdown.keywordMatch || 0, max: 100 },
    { label: 'STAR Bullet Quality', value: breakdown.bulletQuality || 0, max: 100 },
    { label: 'ATS Format Compliance', value: breakdown.formatting || 0, max: 100 },
    { label: 'Section Completeness', value: breakdown.sectionCompleteness || 0, max: 100 },
    { label: 'Summary Strength', value: breakdown.summaryStrength || 0, max: 100 },
    { label: 'Skill Coverage', value: breakdown.skillCoverage || 0, max: 100 },
    { label: 'Metrics & Quantification', value: breakdown.quantification || 0, max: 100 },
    { label: 'Power Action Verbs', value: breakdown.actionVerbs || 0, max: 100 },
    { label: 'Length & Word Density', value: breakdown.length || 0, max: 100 },
    { label: 'Contact Info Verification', value: breakdown.contactInfo || 0, max: 100 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">ATS Readiness Score</h3>
            <p className="text-[11px] text-slate-500">Applicant Tracking System scan</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRecalculate}
          disabled={loading}
          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title="Recalculate score"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Radial / Big Score Display */}
      <div className="flex items-center gap-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40">
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-200 dark:text-slate-700"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`${getScoreColor(score)} transition-all duration-1000 ease-out`}
              strokeDasharray={`${score}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-black text-slate-900 dark:text-slate-100">{score}</span>
            <span className="text-[9px] uppercase font-bold text-slate-400">/ 100</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getScoreBg(score)}`}>
            {score >= 80 ? 'ATS Ready 🎉' : score >= 60 ? 'Needs Polish ⚠️' : score > 0 ? 'High Risk of Filter ❌' : 'Not Scored Yet'}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {score >= 80
              ? 'Your resume has high keyword density, strong action verbs, and passes ATS filters.'
              : score >= 60
              ? 'Moderate chance of passing. Enhance quantified metrics and keywords to reach 85+.'
              : score > 0
              ? 'Likely to be filtered out by automated screening. Use AI suggestions to optimize.'
              : 'Click below to run a comprehensive 10-point ATS scan on your resume content.'}
          </p>
          {score === 0 && (
            <button
              type="button"
              onClick={handleRecalculate}
              disabled={loading}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Gauge className="w-3.5 h-3.5" />}
              {loading ? 'Scanning Resume...' : 'Scan Resume Now'}
            </button>
          )}
        </div>
      </div>

      {/* 10 Breakdown Metrics Accordion */}
      <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full flex items-center justify-between p-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition cursor-pointer"
        >
          <span>10-Point ATS Audit Breakdown</span>
          {showBreakdown ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showBreakdown && (
          <div className="p-3 space-y-2.5 bg-white dark:bg-slate-900">
            {metrics.map((m, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-slate-400">{m.label}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{m.value}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      m.value >= 75 ? 'bg-emerald-500' : m.value >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${m.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Deep Review Action */}
      <div>
        <button
          type="button"
          onClick={handleDeepReview}
          disabled={reviewLoading}
          className="w-full py-2 px-3 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 rounded-xl border border-indigo-200 dark:border-indigo-900/40 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {reviewLoading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          {reviewLoading ? 'Analyzing Resume With Gemini...' : 'Run Comprehensive AI Review'}
        </button>
      </div>

      {/* Review Feedback Display */}
      {reviewData && (
        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>AI Review Insights</span>
          </div>

          {reviewData.strengths?.length > 0 && (
            <div>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Key Strengths
              </span>
              <ul className="list-disc ml-4 text-slate-600 dark:text-slate-400 mt-1 space-y-0.5">
                {reviewData.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {reviewData.improvements?.length > 0 && (
            <div>
              <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Recommended Improvements
              </span>
              <ul className="list-disc ml-4 text-slate-600 dark:text-slate-400 mt-1 space-y-0.5">
                {reviewData.improvements.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>
          )}

          {reviewData.overallAssessment && (
            <p className="text-slate-700 dark:text-slate-300 italic pt-2 border-t border-slate-200 dark:border-slate-700">
              "{reviewData.overallAssessment}"
            </p>
          )}
        </div>
      )}
    </div>
  );
}
