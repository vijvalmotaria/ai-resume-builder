import React, { forwardRef } from 'react';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import MinimalTemplate from './MinimalTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import CreativeTemplate from './CreativeTemplate';

const ResumePreview = forwardRef(({ resume }, ref) => {
  const templateName = (resume?.template || 'classic').toLowerCase();

  const renderTemplate = () => {
    switch (templateName) {
      case 'modern':
        return <ModernTemplate resume={resume} />;
      case 'minimal':
        return <MinimalTemplate resume={resume} />;
      case 'executive':
        return <ExecutiveTemplate resume={resume} />;
      case 'creative':
        return <CreativeTemplate resume={resume} />;
      case 'classic':
      default:
        return <ClassicTemplate resume={resume} />;
    }
  };

  return (
    <div
      ref={ref}
      id="resume-print-area"
      className="resume-preview-container print:m-0 print:p-0 print:shadow-none bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300"
    >
      {renderTemplate()}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;
