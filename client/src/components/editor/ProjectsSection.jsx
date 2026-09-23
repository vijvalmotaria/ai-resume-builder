import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

function ProjectTechInput({ technologies = [], onChange }) {
  const [input, setInput] = useState('');

  const addTech = (val) => {
    const parts = val.split(',').map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return;
    const next = [...technologies];
    for (const p of parts) {
      if (!next.includes(p)) next.push(p);
    }
    onChange(next);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTech(input);
    }
  };

  const removeTech = (indexToRemove) => {
    onChange(technologies.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
        Technologies & Tools Used
      </label>
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg min-h-[44px]">
        {technologies.map((tech, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
          >
            {tech}
            <button
              type="button"
              onClick={() => removeTech(idx)}
              className="text-indigo-400 hover:text-rose-500 cursor-pointer p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTech(input)}
          placeholder={
            technologies.length === 0
              ? 'Type tech and press Enter or comma (e.g. React, Node.js, AWS)...'
              : 'Add more...'
          }
          className="flex-1 min-w-[140px] text-xs bg-transparent outline-none px-1 py-0.5 text-slate-800 dark:text-slate-200"
        />
      </div>
    </div>
  );
}

export default function ProjectsSection({ projects = [], onChange }) {
  const handleAddProject = () => {
    const newProj = {
      name: '',
      description: '',
      technologies: [],
      link: '',
      startDate: '',
      endDate: '',
    };
    onChange([...projects, newProj]);
  };

  const handleRemove = (index) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleTechChange = (index, techs) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], technologies: techs };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-slate-500">Showcase portfolio projects, open-source work, or case studies.</p>
        <button
          type="button"
          onClick={handleAddProject}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-500">No projects added yet.</p>
          <button
            type="button"
            onClick={handleAddProject}
            className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Add a project
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj, index) => (
            <div
              key={index}
              className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/50 p-4 shadow-sm relative group"
            >
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 rounded transition"
                title="Delete project"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={proj.name || ''}
                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                    placeholder="e.g. Distributed Task Orchestrator"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Live Demo / Repo Link
                  </label>
                  <input
                    type="url"
                    value={proj.link || ''}
                    onChange={(e) => handleFieldChange(index, 'link', e.target.value)}
                    placeholder="e.g. https://github.com/alex/task-runner"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <ProjectTechInput
                    technologies={proj.technologies || []}
                    onChange={(techs) => handleTechChange(index, techs)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project Description & Highlights
                  </label>
                  <textarea
                    rows={2}
                    value={proj.description || ''}
                    onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                    placeholder="Architected a fault-tolerant message queue delivering sub-50ms message processing..."
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
