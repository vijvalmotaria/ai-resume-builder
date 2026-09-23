import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Save, Printer, Sparkles, Target, History, Gauge,
  User, AlignLeft, Briefcase, GraduationCap, Award, FolderGit2, Check,
  Loader2, Bot, LayoutTemplate, ZoomIn, ZoomOut
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { getResume, updateResume, updateTemplate } from '../services/resume.service';
import ResumePreview from '../components/templates/ResumePreview';
import PersonalInfoSection from '../components/editor/PersonalInfoSection';
import SummarySection from '../components/editor/SummarySection';
import ExperienceSection from '../components/editor/ExperienceSection';
import EducationSection from '../components/editor/EducationSection';
import SkillsSection from '../components/editor/SkillsSection';
import ProjectsSection from '../components/editor/ProjectsSection';
import CertificationsSection from '../components/editor/CertificationsSection';
import AtsScoreCard from '../components/ai/AtsScoreCard';
import AIAssistantChat from '../components/ai/AIAssistantChat';
import JobMatcherModal from '../components/ai/JobMatcherModal';
import VersionHistoryModal from '../components/version/VersionHistoryModal';

export default function BuilderPage() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [activeRightPanel, setActiveRightPanel] = useState('ats'); // 'ats' | 'chat' | null
  const [jobMatcherOpen, setJobMatcherOpen] = useState(false);
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const previewRef = useRef(null);

  useEffect(() => {
    if (id) {
      loadResume();
    }
  }, [id]);

  const loadResume = async () => {
    setLoading(true);
    try {
      const data = await getResume(id);
      setResume(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (silent = false) => {
    if (!resume?._id) return;
    setSaving(true);
    try {
      const updated = await updateResume(resume._id, {
        title: resume.title,
        template: resume.template,
        sections: resume.sections,
        lastJobDescription: resume.lastJobDescription,
      });
      setResume(updated);
      if (!silent) toast.success('Changes saved!');
    } catch (err) {
      console.error(err);
      if (!silent) toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleTemplateChange = async (templateName) => {
    setResume((prev) => ({ ...prev, template: templateName }));
    try {
      await updateTemplate(id, templateName);
      toast.success(`Template changed to ${templateName}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const updateSections = (sectionKey, data) => {
    setResume((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: data,
      },
    }));
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'summary', label: 'Summary', icon: AlignLeft },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'certifications', label: 'Certifications', icon: Award },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium text-slate-400">Loading your resume workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
      <Toaster position="top-right" />

      {/* Top Builder Navigation & Controls */}
      <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 backdrop-blur px-4 flex items-center justify-between z-30 sticky top-0 no-print">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <input
            type="text"
            value={resume?.title || ''}
            onChange={(e) => setResume((prev) => ({ ...prev, title: e.target.value }))}
            onBlur={() => handleSave(true)}
            placeholder="Resume Title"
            className="text-sm font-bold bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 outline-none px-1 py-0.5 max-w-[200px] sm:max-w-xs transition"
          />
        </div>

        {/* Center: Template Picker & Zoom Controls */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-2">
            <LayoutTemplate className="w-3.5 h-3.5" />
            <select
              value={resume?.template || 'classic'}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-200 font-medium outline-none cursor-pointer"
            >
              <option value="classic">Classic ATS</option>
              <option value="modern">Modern Tech</option>
              <option value="minimal">Minimal Clean</option>
              <option value="executive">Executive</option>
              <option value="creative">Creative Portfolio</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(60, z - 10))}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(140, z + 10))}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Actions (ATS Score, Job Match, Versions, Print, Save) */}
        <div className="flex items-center gap-2">
          {/* ATS score pill toggle */}
          <button
            type="button"
            onClick={() => setActiveRightPanel(activeRightPanel === 'ats' ? null : 'ats')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border transition cursor-pointer ${
              activeRightPanel === 'ats'
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 border-indigo-300 dark:border-indigo-700'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Gauge className="w-3.5 h-3.5 text-indigo-500" />
            <span>{resume?.atsScore ?? 0}% ATS</span>
          </button>

          {/* AI Coach toggle */}
          <button
            type="button"
            onClick={() => setActiveRightPanel(activeRightPanel === 'chat' ? null : 'chat')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border transition cursor-pointer ${
              activeRightPanel === 'chat'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Coach</span>
          </button>

          {/* Job Matcher modal trigger */}
          <button
            type="button"
            onClick={() => setJobMatcherOpen(true)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Match with Job Description"
          >
            <Target className="w-4 h-4 text-emerald-500" />
          </button>

          {/* Version History */}
          <button
            type="button"
            onClick={() => setVersionModalOpen(true)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Version History & Snapshots"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Print / Export */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition cursor-pointer"
            title="Print or Export PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          {/* Save button */}
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </header>

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Form Editor */}
        <div className="w-full lg:w-[480px] xl:w-[520px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-[calc(100vh-3.5rem)] no-print shrink-0">
          {/* Section Tabs */}
          <div className="flex overflow-x-auto p-2 border-b border-slate-100 dark:border-slate-800 gap-1 no-scrollbar shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content Editor */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'personal' && (
              <PersonalInfoSection
                data={resume?.sections?.personalInfo || {}}
                onChange={(data) => updateSections('personalInfo', data)}
              />
            )}

            {activeTab === 'summary' && (
              <SummarySection
                value={resume?.sections?.summary || ''}
                resume={resume}
                onChange={(val) => updateSections('summary', val)}
              />
            )}

            {activeTab === 'experience' && (
              <ExperienceSection
                experience={resume?.sections?.experience || []}
                onChange={(data) => updateSections('experience', data)}
              />
            )}

            {activeTab === 'education' && (
              <EducationSection
                education={resume?.sections?.education || []}
                onChange={(data) => updateSections('education', data)}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsSection
                skills={resume?.sections?.skills || {}}
                onChange={(data) => updateSections('skills', data)}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsSection
                projects={resume?.sections?.projects || []}
                onChange={(data) => updateSections('projects', data)}
              />
            )}

            {activeTab === 'certifications' && (
              <CertificationsSection
                certifications={resume?.sections?.certifications || []}
                onChange={(data) => updateSections('certifications', data)}
              />
            )}
          </div>
        </div>

        {/* Center Column: Live Scaled Resume Preview */}
        <div className="flex-1 bg-slate-200/60 dark:bg-slate-950 p-6 overflow-y-auto flex items-start justify-center h-[calc(100vh-3.5rem)] print:p-0 print:overflow-visible">
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out',
            }}
            className="w-full max-w-[800px] mb-12 shadow-2xl rounded-lg"
          >
            <ResumePreview ref={previewRef} resume={resume} />
          </div>
        </div>

        {/* Right Collapsible Panel: ATS Score / AI Chat */}
        {activeRightPanel && (
          <div className="w-[360px] xl:w-[400px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-[calc(100vh-3.5rem)] no-print p-4 overflow-y-auto shrink-0 shadow-lg animate-fade-in">
            {activeRightPanel === 'ats' && (
              <AtsScoreCard
                resume={resume}
                onScoreUpdated={(res) => {
                  const newScore = res.atsScore ?? res.overallScore;
                  const newBreakdown = res.atsBreakdown ?? res.breakdown;
                  setResume((prev) => ({
                    ...prev,
                    atsScore: newScore !== undefined ? newScore : prev.atsScore,
                    atsBreakdown: newBreakdown || prev.atsBreakdown,
                  }));
                }}
              />
            )}

            {activeRightPanel === 'chat' && (
              <AIAssistantChat
                resumeId={resume?._id}
                onResumeUpdated={loadResume}
              />
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <JobMatcherModal
        isOpen={jobMatcherOpen}
        onClose={() => setJobMatcherOpen(false)}
        resumeId={resume?._id}
        initialJobDescription={resume?.lastJobDescription || ''}
        onMatchComplete={(data, jd) => {
          setResume((prev) => ({ ...prev, lastJobDescription: jd }));
        }}
      />

      <VersionHistoryModal
        isOpen={versionModalOpen}
        onClose={() => setVersionModalOpen(false)}
        resumeId={resume?._id}
        onRestoreComplete={(restored) => {
          setResume(restored);
        }}
      />
    </div>
  );
}
