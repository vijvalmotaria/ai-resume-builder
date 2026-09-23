import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateSummary } from '../../services/ai.service';

export default function SummarySection({ value = '', onChange, resume }) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateSummary({
        personalInfo: resume?.sections?.personalInfo,
        experience: resume?.sections?.experience,
        skills: resume?.sections?.skills,
        jobDescription: resume?.lastJobDescription || '',
      });

      if (res?.summary) {
        onChange(res.summary);
        toast.success('AI summary generated successfully!');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to generate summary with AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Professional Summary
        </label>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {loading ? 'Crafting Summary...' : 'Generate with AI'}
        </button>
      </div>

      <textarea
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="A results-oriented Software Engineer with 4+ years of experience designing scalable microservices..."
        className="w-full p-3 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-y"
      />
      <div className="flex justify-between text-[11px] text-slate-500">
        <span>Recommended length: 3–4 impactful sentences</span>
        <span>{value ? value.split(/\s+/).filter(Boolean).length : 0} words</span>
      </div>
    </div>
  );
}
