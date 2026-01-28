import React, { useState, useEffect } from 'react';
import AnalysisViewer from './components/AnalysisViewer';
import MarkdownWithLatex from './components/MarkdownWithLatex';
import { DEFAULT_JSON } from './constants';
import { Eye, Layout, Braces, FileText } from 'lucide-react';

const App: React.FC = () => {
  // Initialize state from localStorage or defaults
  const [inputContent, setInputContent] = useState<string>(() => {
    return localStorage.getItem('homework-viewer-content') || DEFAULT_JSON;
  });
  
  const [mode, setMode] = useState<'json' | 'text'>(() => {
    const savedMode = localStorage.getItem('homework-viewer-mode');
    return (savedMode === 'json' || savedMode === 'text') ? savedMode : 'json';
  });

  const [parsedData, setParsedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'preview'>('preview');

  // Persist input content
  useEffect(() => {
    localStorage.setItem('homework-viewer-content', inputContent);
  }, [inputContent]);

  // Persist mode
  useEffect(() => {
    localStorage.setItem('homework-viewer-mode', mode);
  }, [mode]);

  useEffect(() => {
    if (mode === 'json') {
      try {
        const parsed = JSON.parse(inputContent);
        setParsedData(parsed);
        setError(null);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Unknown error parsing JSON");
        }
      }
    } else {
      // In text mode, we treat content as valid raw string
      setError(null);
    }
  }, [inputContent, mode]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      
      {/* Sidebar / Input Section */}
      <div className={`
        flex-col md:w-1/3 border-r border-slate-200 bg-white h-[50vh] md:h-screen flex
        ${activeTab === 'input' ? 'flex' : 'hidden md:flex'}
      `}>
        <div className="p-4 border-b border-slate-100 flex flex-col gap-4 bg-slate-50">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2">
              {mode === 'json' ? <Braces className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
              {mode === 'json' ? 'JSON Input' : 'Markdown Input'}
            </h2>
            {mode === 'json' && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${error ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {error ? 'Invalid' : 'Valid'}
              </span>
            )}
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-slate-200 p-1 rounded-lg">
             <button
                onClick={() => setMode('json')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'json' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
             >
                <Braces className="w-3.5 h-3.5" /> JSON
             </button>
             <button
                onClick={() => setMode('text')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'text' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
             >
                <FileText className="w-3.5 h-3.5" /> Text/MD
             </button>
          </div>
        </div>
        
        <textarea
          className="flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-100 text-slate-600 bg-white"
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          placeholder={mode === 'json' ? "Paste your JSON here..." : "Paste your text containing LaTeX here.\nSupports Markdown (## Title, **Bold**, etc) and Math ($x=2$ or implicit 1+2=3)."}
          spellCheck={false}
        />
      </div>

      {/* Main Preview Section */}
      <div className={`
        flex-1 bg-slate-100 h-[50vh] md:h-screen overflow-hidden flex flex-col
        ${activeTab === 'preview' ? 'flex' : 'hidden md:flex'}
      `}>
        <div className="p-4 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm z-10 flex items-center justify-between md:justify-end">
            <h2 className="md:hidden font-semibold text-slate-700 flex items-center gap-2">
                <Layout className="w-4 h-4" /> Preview
            </h2>
             {/* Mobile Tabs Toggle */}
             <div className="flex md:hidden bg-slate-200 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('input')}
                    className={`p-1.5 rounded-md transition-all ${activeTab === 'input' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                >
                    {mode === 'json' ? <Braces className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </button>
                <button 
                    onClick={() => setActiveTab('preview')}
                    className={`p-1.5 rounded-md transition-all ${activeTab === 'preview' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
                >
                    <Eye className="w-4 h-4" />
                </button>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-4xl mx-auto">
            {mode === 'json' ? (
              <AnalysisViewer data={parsedData} error={error} />
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[50vh]">
                <MarkdownWithLatex content={inputContent} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;