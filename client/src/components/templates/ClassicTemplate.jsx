import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from 'lucide-react';

export default function ClassicTemplate({ resume }) {
  const { sections = {}, title } = resume || {};
  const { personalInfo = {}, summary = '', experience = [], education = [], skills = {}, projects = [], certifications = [] } = sections;

  return (
    <div className="bg-white text-slate-900 font-serif p-8 max-w-[800px] mx-auto min-h-[1050px] shadow-sm text-[13px] leading-relaxed">
      {/* Header */}
      <header className="border-b-2 border-slate-900 pb-4 mb-4 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900 mb-1">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-600 text-[11px] font-sans">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-700" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-700" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-700" /> {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3 text-slate-700" /> {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1">
              <Github className="w-3 h-3 text-slate-700" /> {personalInfo.github}
            </span>
          )}
          {personalInfo.portfolio && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-700" /> {personalInfo.portfolio}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 font-sans">
            Professional Summary
          </h2>
          <p className="text-slate-800 text-justify">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2 font-sans">
            Work Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={exp._id || idx}>
                <div className="flex justify-between items-baseline font-sans text-[12px]">
                  <div>
                    <span className="font-bold text-slate-900">{exp.role}</span>
                    {exp.company && <span className="text-slate-700 font-serif italic"> — {exp.company}</span>}
                    {exp.location && <span className="text-slate-500 text-[11px]">, {exp.location}</span>}
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    {exp.startDate} {exp.startDate && (exp.endDate || exp.current) && '–'} {exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>
                {exp.description && <p className="text-slate-700 mt-1 italic text-[12px]">{exp.description}</p>}
                {exp.bullets?.length > 0 && (
                  <ul className="list-disc ml-5 mt-1 space-y-0.5 text-slate-800">
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
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
        <section className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2 font-sans">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={edu._id || idx} className="flex justify-between items-baseline font-sans text-[12px]">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree} {edu.field && `in ${edu.field}`}</span>
                  {edu.institution && <div className="text-slate-700 font-serif italic">{edu.institution}</div>}
                  {edu.gpa && <span className="text-slate-600 text-[11px]">GPA: {edu.gpa}</span>}
                </div>
                <div className="text-slate-600 text-[11px]">
                  {edu.startDate} {edu.startDate && edu.endDate && '–'} {edu.endDate}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && Object.entries(skills).some(([_, list]) => Array.isArray(list) && list.length > 0) && (
        <section className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 font-sans">
            Skills & Competencies
          </h2>
          <div className="space-y-1 text-[12px]">
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
                  <strong className="font-sans text-slate-900">{title}: </strong>
                  <span className="text-slate-800">{list.join(', ')}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2 font-sans">
            Key Projects
          </h2>
          <div className="space-y-2">
            {projects.map((proj, idx) => (
              <div key={proj._id || idx}>
                <div className="flex justify-between items-baseline font-sans text-[12px]">
                  <span className="font-bold text-slate-900">{proj.name}</span>
                  {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-blue-700 underline text-[11px]">Link</a>}
                </div>
                {proj.technologies?.length > 0 && (
                  <p className="text-[11px] text-slate-600 font-sans italic">Tech: {proj.technologies.join(', ')}</p>
                )}
                {proj.description && <p className="text-slate-800 mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <section className="mb-2">
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5 font-sans">
            Certifications
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
            {certifications.map((cert, idx) => (
              <div key={cert._id || idx} className="text-slate-800">
                <span className="font-bold">{cert.name}</span>
                {cert.issuer && <span className="italic text-slate-600"> — {cert.issuer}</span>}
                {cert.date && <span className="text-slate-500 text-[11px]"> ({cert.date})</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
