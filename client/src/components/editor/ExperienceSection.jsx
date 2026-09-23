import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateBullets } from '../../services/ai.service';

export default function ExperienceSection({ experience = [], onChange }) {
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAddExperience = () => {
    const newExp = {
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      bullets: [''],
      location: '',
    };
    onChange([...experience, newExp]);
    setExpanded((prev) => ({ ...prev, [experience.length]: true }));
  };

  const handleRemoveExperience = (index) => {
    const updated = experience.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleBulletChange = (expIndex, bulletIndex, value) => {
    const updated = [...experience];
    const newBullets = [...(updated[expIndex].bullets || [])];
    newBullets[bulletIndex] = value;
    updated[expIndex].bullets = newBullets;
    onChange(updated);
  };

  const handleAddBullet = (expIndex) => {
    const updated = [...experience];
    const newBullets = [...(updated[expIndex].bullets || []), ''];
    updated[expIndex].bullets = newBullets;
    onChange(updated);
  };

  const handleRemoveBullet = (expIndex, bulletIndex) => {
    const updated = [...experience];
    const newBullets = updated[expIndex].bullets.filter((_, i) => i !== bulletIndex);
    updated[expIndex].bullets = newBullets;
    onChange(updated);
  };

  const handleAIBulletGen = async (index) => {
    const exp = experience[index];
    if (!exp.role) {
      toast.error('Please enter a role first so the AI can generate relevant bullet points');
      return;
    }

    setLoadingIndex(index);
    try {
      const res = await generateBullets({
        role: exp.role,
        company: exp.company,
        description: exp.description || exp.role,
      });

      if (res?.bullets?.length) {
        const updated = [...experience];
        const existing = updated[index].bullets?.filter(Boolean) || [];
        updated[index].bullets = [...existing, ...res.bullets];
        onChange(updated);
        toast.success(`Generated ${res.bullets.length} STAR-method bullet points!`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to generate bullets with AI');
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-slate-500">
          List your relevant work history. Use STAR method for achievements (Action + Metric + Result).
        </p>
        <button
          type="button"
          onClick={handleAddExperience}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Experience
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-500">No work experience added yet.</p>
          <button
            type="button"
            onClick={handleAddExperience}
            className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Click here to add your first role
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((exp, index) => {
            const isExpanded = expanded[index] ?? true;
            return (
              <div
                key={index}
                className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/50 overflow-hidden shadow-sm transition"
              >
                {/* Header bar */}
                <div
                  onClick={() => toggleExpand(index)}
                  className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {exp.role || 'Untitled Role'} {exp.company && `at ${exp.company}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveExperience(index);
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 rounded transition"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Job Title / Role *
                        </label>
                        <input
                          type="text"
                          value={exp.role || ''}
                          onChange={(e) => handleFieldChange(index, 'role', e.target.value)}
                          placeholder="e.g. Senior Software Engineer"
                          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Company / Employer *
                        </label>
                        <input
                          type="text"
                          value={exp.company || ''}
                          onChange={(e) => handleFieldChange(index, 'company', e.target.value)}
                          placeholder="e.g. Acme Corp"
                          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => handleFieldChange(index, 'location', e.target.value)}
                          placeholder="e.g. New York, NY (or Remote)"
                          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>

                      <div className="flex gap-2 items-center">
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Start Date
                          </label>
                          <input
                            type="text"
                            value={exp.startDate || ''}
                            onChange={(e) => handleFieldChange(index, 'startDate', e.target.value)}
                            placeholder="Jan 2022"
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            End Date
                          </label>
                          <input
                            type="text"
                            disabled={exp.current}
                            value={exp.current ? 'Present' : exp.endDate || ''}
                            onChange={(e) => handleFieldChange(index, 'endDate', e.target.value)}
                            placeholder="Present"
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100 dark:disabled:bg-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current-${index}`}
                        checked={exp.current || false}
                        onChange={(e) => handleFieldChange(index, 'current', e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor={`current-${index}`} className="text-xs text-slate-600 dark:text-slate-400">
                        I currently work here
                      </label>
                    </div>

                    {/* Bullet Points with AI STAR Generator */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Bullet Points (STAR Method)
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAIBulletGen(index)}
                          disabled={loadingIndex === index}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-md transition cursor-pointer disabled:opacity-50"
                        >
                          {loadingIndex === index ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3" />
                          )}
                          {loadingIndex === index ? 'Generating...' : 'AI Generate Bullets'}
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(exp.bullets || []).map((bullet, bIdx) => (
                          <div key={bIdx} className="flex gap-2 items-start">
                            <span className="text-slate-400 mt-2.5 text-xs font-bold">•</span>
                            <textarea
                              rows={2}
                              value={bullet}
                              onChange={(e) => handleBulletChange(index, bIdx, e.target.value)}
                              placeholder="e.g. Engineered real-time telemetry service reducing latency by 45% for 2M daily active users."
                              className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveBullet(index, bIdx)}
                              className="p-1.5 text-slate-400 hover:text-red-500 rounded mt-1"
                              title="Delete bullet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddBullet(index)}
                        className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add bullet point
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
