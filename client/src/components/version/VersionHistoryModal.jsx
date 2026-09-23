import React, { useState, useEffect } from 'react';
import { X, History, Plus, RotateCcw, Trash2, Calendar, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveVersion, getVersions, restoreVersion, deleteVersion } from '../../services/version.service';

export default function VersionHistoryModal({ isOpen, onClose, resumeId, onRestoreComplete }) {
  const [versions, setVersions] = useState([]);
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [restoringId, setRestoringId] = useState(null);

  useEffect(() => {
    if (isOpen && resumeId) {
      loadVersions();
    }
  }, [isOpen, resumeId]);

  if (!isOpen) return null;

  const loadVersions = async () => {
    setLoading(true);
    try {
      const data = await getVersions(resumeId);
      setVersions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load version history');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSnapshot = async (e) => {
    e.preventDefault();
    if (!label.trim()) return;

    setSaving(true);
    try {
      const newVersion = await saveVersion(resumeId, label.trim());
      setVersions((prev) => [newVersion, ...prev]);
      setLabel('');
      toast.success('Resume version saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save version snapshot');
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async (versionId) => {
    if (!window.confirm('Are you sure you want to restore this version? Your current unsaved changes will be replaced.')) return;

    setRestoringId(versionId);
    try {
      const restoredResume = await restoreVersion(resumeId, versionId);
      toast.success('Resume restored successfully!');
      if (onRestoreComplete) onRestoreComplete(restoredResume);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to restore version');
    } finally {
      setRestoringId(null);
    }
  };

  const handleDelete = async (versionId) => {
    if (!window.confirm('Delete this version snapshot?')) return;

    try {
      await deleteVersion(resumeId, versionId);
      setVersions((prev) => prev.filter((v) => v._id !== versionId));
      toast.success('Version deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete version');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Version History & Snapshots</h2>
              <p className="text-[11px] text-slate-500">Track tailored iterations and revert anytime</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Create Snapshot Form */}
        <form onSubmit={handleCreateSnapshot} className="p-4 border-b border-slate-100 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label this version (e.g. 'Tailored for Stripe Frontend role')..."
            className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            type="submit"
            disabled={saving || !label.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition cursor-pointer disabled:opacity-50 shrink-0"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Save Snapshot
          </button>
        </form>

        {/* Version List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 text-xs">
          {loading ? (
            <div className="flex justify-center items-center py-12 text-slate-400 gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading versions...</span>
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>No version snapshots saved yet.</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Save snapshots when tailoring for different companies or job applications.
              </p>
            </div>
          ) : (
            versions.map((ver) => (
              <div
                key={ver._id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-300 dark:hover:border-indigo-800 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                      {ver.label || `Version #${ver.versionNumber || '1'}`}
                    </span>
                    {ver.atsScore !== undefined && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        {ver.atsScore}% ATS
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(ver.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRestore(ver._id)}
                    disabled={restoringId === ver._id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-lg transition cursor-pointer disabled:opacity-50"
                  >
                    {restoringId === ver._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                    Restore
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(ver._id)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded transition cursor-pointer"
                    title="Delete version"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
