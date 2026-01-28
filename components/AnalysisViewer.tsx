import React from 'react';
import { Analysis } from '../types';
import LatexText from './LatexText';
import { AlertCircle, CheckCircle2, Ruler, BookOpen, BrainCircuit } from 'lucide-react';

interface AnalysisViewerProps {
  data: any;
  error: string | null;
}

const Tag: React.FC<{ text: string; color: 'blue' | 'red' | 'gray' }> = ({ text, color }) => {
  const styles = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-md border ${styles[color]}`}>
      {text}
    </span>
  );
};

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

  // Determine if valid analysis data exists in one of the supported formats
  let analysis: Analysis | null = null;
  
  if (data) {
    if (data.analysis) {
        // Standard format: { analysis: { ... } }
        analysis = data.analysis;
    } else if (data.homework_title && Array.isArray(data.wrong_questions)) {
        // Flat format: { homework_title: "...", wrong_questions: [...] }
        analysis = data as Analysis;
    }
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400">
        <p>No valid analysis data found.</p>
        <p className="text-xs mt-2 text-slate-300">Expected JSON with an "analysis" object or direct "homework_title" and "wrong_questions" fields.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">Homework Analysis</span>
        </div>
        <div className="text-2xl font-bold text-slate-900">
            <LatexText text={analysis.homework_title} />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {Array.isArray(analysis.wrong_questions) && analysis.wrong_questions.map((question, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Question Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="text-lg font-semibold text-slate-800 flex items-start gap-2">
                   <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded mt-1 shrink-0">#{idx + 1}</span>
                   <LatexText text={question.problem_title} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                {Array.isArray(question.problem_types) && question.problem_types.map((type, tIdx) => (
                    <Tag key={tIdx} text={type} color="blue" />
                ))}
                {Array.isArray(question.error_tags) && question.error_tags.map((tag, tIdx) => (
                    <Tag key={tIdx} text={tag} color="red" />
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100">
                {/* Problem Text */}
                <div className="p-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Ruler className="w-4 h-4" /> Problem Statement
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <LatexText text={question.problem_text} />
                    </div>
                </div>

                {/* Student Answer & Analysis */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full border-2 border-red-400 flex items-center justify-center text-[10px] font-bold text-red-500">✕</span>
                            Student Answer
                        </h3>
                        <div className="text-sm text-slate-600 bg-red-50/50 p-4 rounded-lg border border-red-50">
                            <LatexText text={question.student_answer} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4" /> Error Analysis
                        </h3>
                         <div className="text-sm text-slate-700">
                            <LatexText text={question.error_reason} />
                        </div>
                    </div>
                </div>

                 {/* Standard Answer */}
                <div className="p-6 bg-emerald-50/30">
                    <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Standard Solution
                    </h3>
                    <div className="prose prose-sm max-w-none text-slate-800">
                         <LatexText text={question.standard_answer} />
                    </div>
                </div>

                {/* Technical Meta Data */}
                <div className="px-6 py-3 bg-slate-50 text-xs text-slate-400 flex justify-between font-mono">
                    <span>Image Index: {question.image_index}</span>
                    <span>Coords: [{Array.isArray(question.coordinates) ? question.coordinates.join(', ') : ''}]</span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisViewer;