import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from 'lucide-react';

export default function ExecutiveTemplate({ resume }) {
  const { sections = {} } = resume || {};
  const { personalInfo = {}, summary = '', experience = [], education = [], skills = {}, projects = [], certifications = [] } = sections;

  return (
    <div className="bg-white text-slate-900 font-sans max-w-[800px] mx-auto min-h-[1050px] shadow-sm text-[12.5px] leading-relaxed">
      {/* Top Navy Banner */}
      <header className="bg-slate-900 text-white p-8">
        <h1 className="text-2xl font-bold tracking-wider uppercase text-white mb-1">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-amber-400 font-medium text-[13px] tracking-wide uppercase mb-3">
          {experience?.[0]?.role || 'Senior Leader & Strategist'}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-300 text-[11px]">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-amber-400" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-400" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" /> {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3 text-amber-400" /> {personalInfo.linkedin}
            </span>
          )}
        </div>
      </header>

      <div className="p-8">
        {/* Executive Summary */}
        {summary && (
          <section className="mb-5 pb-4 border-b border-slate-200">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-amber-500 inline-block"></span>
              Executive Summary
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <section className="mb-5 pb-4 border-b border-slate-200">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-amber-500 inline-block"></span>
              Executive Experience & Key Accomplishments
            </h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={exp._id || idx}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-[13px]">{exp.role}</span>
                    <span className="text-slate-500 text-[11px]">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-slate-600 font-medium text-[12px] mb-1">
                    {exp.company} {exp.location && `| ${exp.location}`}
                  </div>
                  {exp.description && <p className="text-slate-700 mb-1">{exp.description}</p>}
                  {exp.bullets?.length > 0 && (
                    <ul className="list-disc ml-4 space-y-1 text-slate-700">
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

        {/* Core Competencies */}
        {skills && Object.entries(skills).some(([_, list]) => Array.isArray(list) && list.length > 0) && (
          <section className="mb-5 pb-4 border-b border-slate-200">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-amber-500 inline-block"></span>
              Core Competencies & Technical Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[12px]">
              {Object.entries(skills).map(([key, list]) => {
                if (!Array.isArray(list) || list.length === 0) return null;
                const labels = {
                  programmingLanguages: 'Programming Languages',
                  frameworks: 'Frameworks & Libraries',
                  databases: 'Databases & Storage',
                  cloudDevOps: 'Cloud & Infrastructure',
                  tools: 'Tools & Platforms',
                  technical: 'Technical Skills',
                  soft: 'Executive & Soft Skills',
                  languages: 'Languages',
                };
                const title = labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
                return (
                  <div key={key}>
                    <strong className="text-slate-900">{title}: </strong>
                    <span className="text-slate-700">{list.join(', ')}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Education & Credentials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {education?.length > 0 && (
            <section>
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-amber-500 inline-block"></span>
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu, idx) => (
                  <div key={edu._id || idx}>
                    <div className="font-bold text-slate-900">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                    <div className="text-slate-600 text-[11px]">{edu.institution} • {edu.startDate} – {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications?.length > 0 && (
            <section>
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-amber-500 inline-block"></span>
                Certifications
              </h2>
              <div className="space-y-1">
                {certifications.map((c, i) => (
                  <div key={i} className="text-slate-700">
                    <span className="font-medium text-slate-900">{c.name}</span>
                    {c.issuer && <span className="text-slate-500"> — {c.issuer}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
