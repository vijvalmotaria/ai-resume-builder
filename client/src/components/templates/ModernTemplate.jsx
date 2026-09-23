import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from 'lucide-react';

export default function ModernTemplate({ resume }) {
  const { sections = {} } = resume || {};
  const { personalInfo = {}, summary = '', experience = [], education = [], skills = {}, projects = [], certifications = [] } = sections;

  return (
    <div className="bg-white text-slate-800 font-sans p-8 max-w-[800px] mx-auto min-h-[1050px] shadow-sm text-[13px] leading-normal">
      {/* Top Banner with Indigo Accent */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-5 mb-5 border-b-2 border-indigo-600 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-indigo-600 font-medium text-[14px] mt-0.5">
            {experience?.[0]?.role || 'Professional'}
          </p>
        </div>

        <div className="flex flex-col gap-1 text-[11px] text-slate-600 md:text-right">
          {personalInfo.email && (
            <span className="flex items-center md:justify-end gap-1.5">
              <Mail className="w-3 h-3 text-indigo-600" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center md:justify-end gap-1.5">
              <Phone className="w-3 h-3 text-indigo-600" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center md:justify-end gap-1.5">
              <MapPin className="w-3 h-3 text-indigo-600" /> {personalInfo.location}
            </span>
          )}
          <div className="flex items-center md:justify-end gap-2 text-indigo-600 mt-0.5">
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-0.5">
                <Linkedin className="w-3 h-3" /> LinkedIn
              </a>
            )}
            {personalInfo.github && (
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-0.5">
                <Github className="w-3 h-3" /> GitHub
              </a>
            )}
            {personalInfo.portfolio && (
              <a href={personalInfo.portfolio} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-0.5">
                <Globe className="w-3 h-3" /> Portfolio
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-5">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded inline-block mb-2">
            Profile Summary
          </h2>
          <p className="text-slate-700 text-justify leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded inline-block mb-3">
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={exp._id || idx} className="relative pl-3 border-l-2 border-indigo-200">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900 text-[13px]">{exp.role}</h3>
                  <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {exp.startDate} {exp.startDate && (exp.endDate || exp.current) && '–'} {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-[12px] text-slate-600 font-medium mb-1">
                  {exp.company} {exp.location && `• ${exp.location}`}
                </div>
                {exp.description && <p className="text-slate-700 mb-1.5 text-[12px]">{exp.description}</p>}
                {exp.bullets?.length > 0 && (
                  <ul className="space-y-1 text-slate-700 text-[12px]">
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <span className="text-indigo-600 text-[14px] leading-none">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Two-column layout for Education & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Education */}
        {education?.length > 0 && (
          <section>
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded inline-block mb-2">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={edu._id || idx}>
                  <h3 className="font-bold text-slate-900 text-[12px]">{edu.degree}</h3>
                  <div className="text-slate-700 text-[12px]">{edu.institution}</div>
                  <div className="text-[11px] text-slate-500">
                    {edu.startDate} – {edu.endDate} {edu.gpa && `• GPA: ${edu.gpa}`}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && Object.entries(skills).some(([_, list]) => Array.isArray(list) && list.length > 0) && (
          <section>
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded inline-block mb-2">
              Skills & Expertise
            </h2>
            <div className="space-y-2.5 text-[12px]">
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
                  <div key={key}>
                    <span className="font-semibold text-slate-800 block text-[11px] uppercase tracking-wide text-slate-500">
                      {title}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {list.map((s, i) => (
                        <span key={i} className="bg-indigo-50/70 border border-indigo-100 text-indigo-900 px-2 py-0.5 rounded text-[11px] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Projects */}
      {projects?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded inline-block mb-2">
            Key Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projects.map((proj, idx) => (
              <div key={proj._id || idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900 text-[12px]">{proj.name}</h3>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-indigo-600 text-[11px] hover:underline">
                      View
                    </a>
                  )}
                </div>
                {proj.technologies?.length > 0 && (
                  <p className="text-[10px] text-indigo-600 font-medium">{proj.technologies.join(', ')}</p>
                )}
                {proj.description && <p className="text-slate-600 text-[11px] mt-1">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <section>
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded inline-block mb-2">
            Certifications
          </h2>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {certifications.map((c, i) => (
              <div key={i} className="bg-indigo-50/50 border border-indigo-100 rounded px-2.5 py-1 text-slate-700">
                <span className="font-semibold text-slate-900">{c.name}</span>
                {c.issuer && <span className="text-slate-500"> • {c.issuer}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
