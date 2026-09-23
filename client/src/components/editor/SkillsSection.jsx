import React, { useState } from 'react';
import { X, Plus, Sparkles, Code2, Database, Cloud, Wrench, Users, Globe, Cpu, FolderPlus, Trash2 } from 'lucide-react';

function TagInput({ label, icon: Icon, tags = [], onTagsChange, placeholder, suggestions = [] }) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    }
  };

  const addTag = (val) => {
    const parts = val.split(',').map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return;
    const next = [...tags];
    for (const p of parts) {
      if (!next.includes(p)) next.push(p);
    }
    onTagsChange(next);
    setInput('');
  };

  const removeTag = (indexToRemove) => {
    onTagsChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-2 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 bg-white dark:bg-slate-900/50 shadow-sm">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          {Icon && <Icon className="w-4 h-4 text-indigo-500" />}
          <span>{label}</span>
          <span className="text-[11px] font-normal text-slate-400">({tags.length})</span>
        </label>
      </div>

      {/* Tag pills */}
      <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg min-h-[44px] items-center">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-2xs"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(idx)}
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
          onBlur={() => addTag(input)}
          placeholder={tags.length === 0 ? placeholder : 'Add more...'}
          className="flex-1 min-w-[140px] bg-transparent text-xs outline-none px-1 py-0.5 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
        />
      </div>

      {/* Quick Add Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 pt-0.5">
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Quick Add:</span>
          {suggestions
            .filter((s) => !tags.includes(s))
            .slice(0, 6)
            .map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => addTag(s)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950 transition cursor-pointer"
              >
                + {s}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default function SkillsSection({ skills = {}, onChange }) {
  const [newCatName, setNewCatName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Standard predefined skill categories
  const defaultCategories = [
    {
      key: 'programmingLanguages',
      label: 'Programming Languages',
      icon: Code2,
      placeholder: 'e.g. JavaScript, Python, TypeScript, Java, Go, C++...',
      suggestions: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'C++', 'C#', 'Rust', 'PHP', 'Ruby', 'SQL'],
    },
    {
      key: 'frameworks',
      label: 'Frameworks & Libraries',
      icon: Cpu,
      placeholder: 'e.g. React, Next.js, Node.js, Express, Spring Boot...',
      suggestions: ['React', 'Next.js', 'Node.js', 'Express', 'Vue.js', 'Angular', 'Django', 'FastAPI', 'Spring Boot', 'Tailwind CSS'],
    },
    {
      key: 'databases',
      label: 'Databases & Storage',
      icon: Database,
      placeholder: 'e.g. PostgreSQL, MongoDB, Redis, MySQL...',
      suggestions: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'DynamoDB', 'Elasticsearch', 'Oracle', 'SQLite', 'Firebase'],
    },
    {
      key: 'cloudDevOps',
      label: 'Cloud & DevOps',
      icon: Cloud,
      placeholder: 'e.g. AWS, Docker, Kubernetes, CI/CD, Azure...',
      suggestions: ['AWS', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Azure', 'Google Cloud (GCP)', 'Terraform', 'GitHub Actions', 'Nginx'],
    },
    {
      key: 'tools',
      label: 'Tools & Platforms',
      icon: Wrench,
      placeholder: 'e.g. Git, GitHub, Postman, Linux, Jira...',
      suggestions: ['Git', 'GitHub', 'Linux / Bash', 'Postman', 'Jira', 'Figma', 'Jest / Vitest', 'Vite', 'Webpack'],
    },
    {
      key: 'soft',
      label: 'Professional & Soft Skills',
      icon: Users,
      placeholder: 'e.g. Cross-functional Leadership, Agile/Scrum, Problem Solving...',
      suggestions: ['Team Leadership', 'Agile & Scrum', 'Cross-functional Communication', 'System Design', 'Problem Solving', 'Mentorship'],
    },
    {
      key: 'languages',
      label: 'Spoken Languages',
      icon: Globe,
      placeholder: 'e.g. English (Fluent), Spanish, French...',
      suggestions: ['English (Fluent)', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese'],
    },
  ];

  // If user had legacy `technical` skills, merge them or keep them visible
  const legacyTechnical = skills.technical || [];

  const handleUpdateCategory = (key, tags) => {
    onChange({
      ...skills,
      [key]: tags,
    });
  };

  const handleAddCustomCategory = (e) => {
    e.preventDefault();
    const clean = newCatName.trim();
    if (!clean) return;

    // Use camelCase or slug as key
    const key = clean.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    if (!skills[key]) {
      onChange({
        ...skills,
        [key]: [],
      });
    }
    setNewCatName('');
    setShowAddCategory(false);
  };

  const handleRemoveCustomCategory = (key) => {
    const updated = { ...skills };
    delete updated[key];
    onChange(updated);
  };

  // Find any custom categories that aren't in defaultCategories or 'technical'
  const defaultKeys = defaultCategories.map((c) => c.key).concat(['technical']);
  const customKeys = Object.keys(skills).filter((k) => !defaultKeys.includes(k) && Array.isArray(skills[k]));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <div>
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Differentiated Skill Categorization</h3>
          <p className="text-[11px] text-slate-500">
            Categorizing your skills (Programming, Databases, Cloud) helps ATS parsers and recruiters evaluate your strengths faster.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddCategory(!showAddCategory)}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-lg transition cursor-pointer shrink-0"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>+ Custom Category</span>
        </button>
      </div>

      {/* Add Custom Category Popover */}
      {showAddCategory && (
        <form onSubmit={handleAddCustomCategory} className="flex gap-2 p-3 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-xl">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Category Name (e.g. AI & Machine Learning, Testing & QA)..."
            className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
          >
            Add Category
          </button>
        </form>
      )}

      {/* Legacy technical skills banner if present */}
      {legacyTechnical.length > 0 && (
        <TagInput
          label="General Technical Skills (Imported)"
          icon={Cpu}
          tags={legacyTechnical}
          onTagsChange={(tags) => handleUpdateCategory('technical', tags)}
          placeholder="General technical skills..."
          suggestions={[]}
        />
      )}

      {/* Standard Categories */}
      {defaultCategories.map((cat) => (
        <TagInput
          key={cat.key}
          label={cat.label}
          icon={cat.icon}
          tags={skills[cat.key] || []}
          onTagsChange={(tags) => handleUpdateCategory(cat.key, tags)}
          placeholder={cat.placeholder}
          suggestions={cat.suggestions}
        />
      ))}

      {/* Custom Categories */}
      {customKeys.map((catKey) => {
        const readableName = catKey
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase());

        return (
          <div key={catKey} className="relative group">
            <TagInput
              label={readableName}
              icon={FolderPlus}
              tags={skills[catKey] || []}
              onTagsChange={(tags) => handleUpdateCategory(catKey, tags)}
              placeholder={`Add ${readableName}...`}
              suggestions={[]}
            />
            <button
              type="button"
              onClick={() => handleRemoveCustomCategory(catKey)}
              className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 p-1 rounded cursor-pointer"
              title="Delete custom category"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
