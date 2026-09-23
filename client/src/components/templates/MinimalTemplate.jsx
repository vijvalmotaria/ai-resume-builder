import React from 'react';

export default function MinimalTemplate({ resume }) {
  const { sections = {} } = resume || {};
  const { personalInfo = {}, summary = '', experience = [], education = [], skills = {}, projects = [], certifications = [] } = sections;

  return (
    <div className="bg-white text-zinc-800 font-sans p-10 max-w-[800px] mx-auto min-h-[1050px] shadow-sm text-[12.5px] leading-relaxed">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-light tracking-tight text-zinc-900 mb-1">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-zinc-500 text-[11px]">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>• {personalInfo.github}</span>}
          {personalInfo.portfolio && <span>• {personalInfo.portfolio}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <p className="text-zinc-600 leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-3">
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={exp._id || idx}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-zinc-900">{exp.role}</span>
                    {exp.company && <span className="text-zinc-500">, {exp.company}</span>}
                  </div>
                  <span className="text-zinc-400 text-[11px]">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && <p className="text-zinc-600 mt-0.5 text-[12px]">{exp.description}</p>}
                {exp.bullets?.length > 0 && (
                  <ul className="list-disc ml-4 mt-1 space-y-0.5 text-zinc-600 text-[12px]">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-3">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={edu._id || idx} className="flex justify-between items-baseline">
                <div>
                  <span className="font-medium text-zinc-900">{edu.degree} {edu.field && `in ${edu.field}`}</span>
                  <div className="text-zinc-500 text-[11px]">{edu.institution}</div>
                </div>
                <span className="text-zinc-400 text-[11px]">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && Object.entries(skills).some(([_, list]) => Array.isArray(list) && list.length > 0) && (
        <section className="mb-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">
            Skills & Competencies
          </h2>
          <div className="space-y-1 text-zinc-600 text-[12px]">
            {Object.entries(skills).map(([key, list]) => {
              if (!Array.isArray(list) || list.length === 0) return null;
              const labels = {
                programmingLanguages: 'Programming Languages',
                frameworks: 'Frameworks & Libraries',
                databases: 'Databases & Storage',
                cloudDevOps: 'Cloud & DevOps',
                tools: 'Tools & Platforms',
                technical: 'Technical Skills',
                soft: 'Professional Skills',
                languages: 'Languages',
              };
              const title = labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
              return (
                <p key={key}>
                  <span className="font-medium text-zinc-800">{title}:</span> {list.join(', ')}
                </p>
              );
            })}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">
            Projects
          </h2>
          <div className="space-y-2">
            {projects.map((proj, idx) => (
              <div key={proj._id || idx}>
                <span className="font-medium text-zinc-900">{proj.name}</span>
                {proj.technologies?.length > 0 && (
                  <span className="text-zinc-400 text-[11px]"> ({proj.technologies.join(', ')})</span>
                )}
                {proj.description && <p className="text-zinc-600 text-[11.5px] mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">
            Certifications
          </h2>
          <div className="text-zinc-600 text-[12px] space-y-0.5">
            {certifications.map((c, i) => (
              <div key={i}>{c.name} {c.issuer && `— ${c.issuer}`} {c.date && `(${c.date})`}</div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
