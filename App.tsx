import React, { useState, useEffect, useMemo } from 'react';
import AnalysisViewer from './components/AnalysisViewer';
import LatexText, { renderLatexToFragment } from './components/LatexText';
import { DEFAULT_JSON } from './constants';
import { Code2, Eye, Layout, Braces, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownWithLatex: React.FC<{ content: string }> = ({ content }) => {
  const components = useMemo(() => {
    // Helper to process text nodes for LaTeX
    const process = (children: React.ReactNode) => {
      return React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return renderLatexToFragment(child);
        }
        return child;
      });
    };

    return {
      // Block elements
      p: ({ children, ...props }: any) => <p className="mb-4 leading-relaxed" {...props}>{process(children)}</p>,
      h1: ({ children, ...props }: any) => <h1 className="text-3xl font-bold mb-4 mt-6 text-slate-900" {...props}>{process(children)}</h1>,
      h2: ({ children, ...props }: any) => <h2 className="text-2xl font-bold mb-3 mt-5 text-slate-800" {...props}>{process(children)}</h2>,
      h3: ({ children, ...props }: any) => <h3 className="text-xl font-bold mb-2 mt-4 text-slate-800" {...props}>{process(children)}</h3>,
      h4: ({ children, ...props }: any) => <h4 className="text-lg font-bold mb-2 mt-4 text-slate-800" {...props}>{process(children)}</h4>,
      ul: ({ children, ...props }: any) => <ul className="list-disc list-outside ml-6 mb-4 space-y-1" {...props}>{children}</ul>,
      ol: ({ children, ...props }: any) => <ol className="list-decimal list-outside ml-6 mb-4 space-y-1" {...props}>{children}</ol>,
      li: ({ children, ...props }: any) => <li className="" {...props}>{process(children)}</li>,
      blockquote: ({ children, ...props }: any) => <blockquote className="border-l-4 border-blue-200 bg-blue-50 py-2 px-4 rounded-r italic my-4 text-slate-700" {...props}>{process(children)}</blockquote>,
      table: ({ children, ...props }: any) => <div className="overflow-x-auto mb-4 border border-slate-200 rounded-lg"><table className="min-w-full divide-y divide-slate-200" {...props}>{children}</table></div>,
      thead: ({ children, ...props }: any) => <thead className="bg-slate-50" {...props}>{children}</thead>,
      tbody: ({ children, ...props }: any) => <tbody className="divide-y divide-slate-200 bg-white" {...props}>{children}</tbody>,
      tr: ({ children, ...props }: any) => <tr {...props}>{children}</tr>,
      th: ({ children, ...props }: any) => <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider" {...props}>{process(children)}</th>,
      td: ({ children, ...props }: any) => <td className="px-3 py-2 text-sm text-slate-700" {...props}>{process(children)}</td>,
      
      // Inline elements
      strong: ({ children, ...props }: any) => <strong className="font-bold text-slate-900" {...props}>{process(children)}</strong>,
      em: ({ children, ...props }: any) => <em className="italic" {...props}>{process(children)}</em>,
      a: ({ children, ...props }: any) => <a className="text-blue-600 hover:underline" {...props}>{process(children)}</a>,
      
      // Code - skip latex processing
      code: ({ children, className, ...props }: any) => {
        const isBlock = /language-(\w+)/.test(className || '');
        return isBlock 
            ? <code className={`${className}`} {...props}>{children}</code>
            : <code className="bg-slate-100 text-red-500 rounded px-1.5 py-0.5 text-sm font-mono border border-slate-200" {...props}>{children}</code>;
      },
      pre: ({ children, ...props }: any) => <pre className="bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm font-mono" {...props}>{children}</pre>
    };
  }, []);

  return (
    <div className="font-serif text-slate-800">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

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