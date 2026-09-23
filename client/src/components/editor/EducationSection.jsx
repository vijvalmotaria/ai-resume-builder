import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function EducationSection({ education = [], onChange }) {
  const handleAddEducation = () => {
    const newEdu = {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: [],
    };
    onChange([...education, newEdu]);
  };

  const handleRemove = (index) => {
    onChange(education.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-slate-500">Add your degrees, certifications, or formal education.</p>
        <button
          type="button"
          onClick={handleAddEducation}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Education
        </button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-500">No education entries added yet.</p>
          <button
            type="button"
            onClick={handleAddEducation}
            className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Add degree / school
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div
              key={index}
              className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/50 p-4 shadow-sm relative group"
            >
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 rounded transition"
                title="Delete education"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Institution / University *
                  </label>
                  <input
                    type="text"
                    value={edu.institution || ''}
                    onChange={(e) => handleFieldChange(index, 'institution', e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Degree *
                  </label>
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => handleFieldChange(index, 'degree', e.target.value)}
                    placeholder="e.g. Bachelor of Science"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={edu.field || ''}
                    onChange={(e) => handleFieldChange(index, 'field', e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Start Year
                    </label>
                    <input
                      type="text"
                      value={edu.startDate || ''}
                      onChange={(e) => handleFieldChange(index, 'startDate', e.target.value)}
                      placeholder="2018"
                      className="w-full px-2 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      End Year
                    </label>
                    <input
                      type="text"
                      value={edu.endDate || ''}
                      onChange={(e) => handleFieldChange(index, 'endDate', e.target.value)}
                      placeholder="2022"
                      className="w-full px-2 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      GPA
                    </label>
                    <input
                      type="text"
                      value={edu.gpa || ''}
                      onChange={(e) => handleFieldChange(index, 'gpa', e.target.value)}
                      placeholder="3.8/4.0"
                      className="w-full px-2 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
