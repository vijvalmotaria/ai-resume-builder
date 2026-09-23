import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function CertificationsSection({ certifications = [], onChange }) {
  const handleAddCert = () => {
    const newCert = {
      name: '',
      issuer: '',
      date: '',
      link: '',
    };
    onChange([...certifications, newCert]);
  };

  const handleRemove = (index) => {
    onChange(certifications.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-slate-500">Add industry certifications, licenses, and badges.</p>
        <button
          type="button"
          onClick={handleAddCert}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Certification
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-500">No certifications added yet.</p>
          <button
            type="button"
            onClick={handleAddCert}
            className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Add your first certification
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/50 p-4 shadow-sm relative group"
            >
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 rounded transition"
                title="Delete certification"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-8">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Certification Name *
                  </label>
                  <input
                    type="text"
                    value={cert.name || ''}
                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                    placeholder="e.g. AWS Certified Solutions Architect - Associate"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Issuer *
                  </label>
                  <input
                    type="text"
                    value={cert.issuer || ''}
                    onChange={(e) => handleFieldChange(index, 'issuer', e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date Earned / Year
                  </label>
                  <input
                    type="text"
                    value={cert.date || ''}
                    onChange={(e) => handleFieldChange(index, 'date', e.target.value)}
                    placeholder="e.g. 2023"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Verification URL / Credential ID
                  </label>
                  <input
                    type="url"
                    value={cert.link || ''}
                    onChange={(e) => handleFieldChange(index, 'link', e.target.value)}
                    placeholder="e.g. https://credly.com/..."
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
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
