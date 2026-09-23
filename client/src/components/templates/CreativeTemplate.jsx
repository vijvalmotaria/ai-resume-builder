import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from 'lucide-react';

export default function CreativeTemplate({ resume }) {
  const { sections = {} } = resume || {};
  const { personalInfo = {}, summary = '', experience = [], education = [], skills = {}, projects = [], certifications = [] } = sections;

  return (
    <div className="bg-white text-slate-800 font-sans max-w-[800px] mx-auto min-h-[1050px] shadow-sm text-[12.5px] grid grid-cols-1 md:grid-cols-3">
      {/* Left Sidebar (Teal / Emerald accent) */}
      <aside className="bg-gradient-to-b from-teal-900 to-slate-900 text-teal-50 p-6 md:col-span-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-teal-300 font-medium text-[13px]">
            {experience?.[0]?.role || 'Creative Professional'}
          </p>
        </div>

        {/* Contact info */}
        <div className="space-y-2 text-[11px] border-t border-teal-700/50 pt-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-teal-400">Contact</h2>
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span className="truncate">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span className="truncate">LinkedIn</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-2">
              <Github className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span className="truncate">GitHub</span>
            </div>
          )}
          {personalInfo.portfolio && (
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span className="truncate">Portfolio</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {skills && Object.entries(skills).some(([_, list]) => Array.isArray(list) && list.length > 0) && (
          <div className="space-y-3 border-t border-teal-700/50 pt-4 text-[11px]">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-teal-400">Skills & Expertise</h2>
            {Object.entries(skills).map(([key, list]) => {
              if (!Array.isArray(list) || list.length === 0) return null;
              const labels = {
                programmingLanguages: 'Programming Languages',
                frameworks: 'Frameworks & Libs',
                databases: 'Databases & Storage',
                cloudDevOps: 'Cloud & DevOps',
                tools: 'Tools & Platforms',
                technical: 'Technical Skills',
                soft: 'Soft Skills',
                languages: 'Languages',
              };
              const title = labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
              return (
                <div key={key}>
                  <span className="text-teal-200 font-semibold block mb-1 text-[10.5px]">{title}</span>
                  <div className="flex flex-wrap gap-1">
                    {list.map((s, i) => (
                      <span key={i} className="bg-teal-800/80 text-teal-100 px-2 py-0.5 rounded text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Education in sidebar */}
        {education?.length > 0 && (
          <div className="space-y-2 border-t border-teal-700/50 pt-4 text-[11px]">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-teal-400">Education</h2>
            {education.map((edu, idx) => (
              <div key={edu._id || idx}>
                <div className="font-semibold text-white">{edu.degree}</div>
                <div className="text-teal-200">{edu.institution}</div>
                <div className="text-teal-400 text-[10px]">{edu.startDate} – {edu.endDate}</div>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="p-6 md:col-span-2 space-y-5">
        {/* Summary */}
        {summary && (
          <section>
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-teal-800 border-b-2 border-teal-600 pb-1 mb-2">
              About Me
            </h2>
            <p className="text-slate-600 leading-relaxed text-justify">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <section>
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-teal-800 border-b-2 border-teal-600 pb-1 mb-3">
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={exp._id || idx}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-[13px]">{exp.role}</h3>
                    <span className="text-[11px] text-teal-700 font-medium">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-slate-600 font-medium text-[11px] mb-1">
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </div>
                  {exp.description && <p className="text-slate-700 mb-1">{exp.description}</p>}
                  {exp.bullets?.length > 0 && (
                    <ul className="list-disc ml-4 space-y-0.5 text-slate-700 text-[12px]">
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

        {/* Projects */}
        {projects?.length > 0 && (
          <section>
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-teal-800 border-b-2 border-teal-600 pb-1 mb-2">
              Featured Projects
            </h2>
            <div className="space-y-2">
              {projects.map((proj, idx) => (
                <div key={proj._id || idx} className="bg-slate-50 p-2.5 rounded border border-slate-100">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900">{proj.name}</span>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-teal-700 text-[11px] hover:underline">
                        View
                      </a>
                    )}
                  </div>
                  {proj.technologies?.length > 0 && (
                    <p className="text-[10px] text-teal-600 font-medium">{proj.technologies.join(', ')}</p>
                  )}
                  {proj.description && <p className="text-slate-600 text-[11.5px] mt-0.5">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <section>
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-teal-800 border-b-2 border-teal-600 pb-1 mb-1.5">
              Certifications
            </h2>
            <div className="space-y-1 text-[11px] text-slate-700">
              {certifications.map((c, i) => (
                <div key={i}>• {c.name} {c.issuer && `(${c.issuer})`} {c.date && `— ${c.date}`}</div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
