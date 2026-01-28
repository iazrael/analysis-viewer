import React from 'react';
import MarkdownWithLatex from './MarkdownWithLatex';
import { AlertCircle, BookOpen } from 'lucide-react';

interface AnalysisViewerProps {
  data: any;
  error: string | null;
}

const AnalysisViewer: React.FC<AnalysisViewerProps> = ({ data, error }) => {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white rounded-lg shadow-sm border border-red-100">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-700">Invalid JSON</h3>
        <p className="text-slate-500 mt-2">{error}</p>
      </div>
    );
  }

  // Handle case where analysis is a string (new format)
  if (data && typeof data.analysis === 'string') {
    return (
      <div className="pb-10">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">Analysis Report</span>
            </div>
            <MarkdownWithLatex content={data.analysis} />
        </div>
        
        {/* Optional Thinking Field Display */}
        {data.thinking && (
            <div className="mt-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                 <h4 className="text-sm font-bold text-slate-500 uppercase mb-2">Thinking Process</h4>
                 <MarkdownWithLatex content={data.thinking} />
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400">
      <p>No valid analysis data found.</p>
      <p className="text-xs mt-2 text-slate-300">Expected JSON with an "analysis" string field.</p>
    </div>
  );
};

export default AnalysisViewer;