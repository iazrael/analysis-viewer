import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { renderLatexToFragment } from './LatexText';

const MarkdownWithLatex: React.FC<{ content: string }> = ({ content }) => {
  // Pre-process content to handle literal "\n" strings (common in JSON) as actual newlines
  const processedContent = useMemo(() => {
    if (!content) return '';
    return content.replace(/\\n/g, '\n');
  }, [content]);

  const components = useMemo(() => {
    // Helper to process text nodes for Implicit LaTeX (not caught by remark-math)
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
      // Removed whitespace-pre-wrap to allow remark-breaks to handle line breaks via <br> tags naturally
      p: ({ children, ...props }: any) => <p className="mb-4 leading-relaxed" {...props}>{process(children)}</p>,
      h1: ({ children, ...props }: any) => <h1 className="text-3xl font-bold mb-4 mt-6 text-slate-900 border-b border-slate-200 pb-2" {...props}>{process(children)}</h1>,
      h2: ({ children, ...props }: any) => <h2 className="text-2xl font-bold mb-3 mt-6 text-slate-800" {...props}>{process(children)}</h2>,
      h3: ({ children, ...props }: any) => <h3 className="text-xl font-bold mb-2 mt-4 text-slate-800" {...props}>{process(children)}</h3>,
      h4: ({ children, ...props }: any) => <h4 className="text-lg font-bold mb-2 mt-4 text-slate-800" {...props}>{process(children)}</h4>,
      ul: ({ children, ...props }: any) => <ul className="list-disc list-outside ml-6 mb-4 space-y-1 text-slate-700" {...props}>{children}</ul>,
      ol: ({ children, ...props }: any) => <ol className="list-decimal list-outside ml-6 mb-4 space-y-1 text-slate-700" {...props}>{children}</ol>,
      li: ({ children, ...props }: any) => <li className="pl-1" {...props}>{process(children)}</li>,
      blockquote: ({ children, ...props }: any) => <blockquote className="border-l-4 border-blue-200 bg-blue-50 py-3 px-4 rounded-r italic my-4 text-slate-700" {...props}>{process(children)}</blockquote>,
      table: ({ children, ...props }: any) => <div className="overflow-x-auto mb-6 border border-slate-200 rounded-lg shadow-sm"><table className="min-w-full divide-y divide-slate-200" {...props}>{children}</table></div>,
      thead: ({ children, ...props }: any) => <thead className="bg-slate-50" {...props}>{children}</thead>,
      tbody: ({ children, ...props }: any) => <tbody className="divide-y divide-slate-200 bg-white" {...props}>{children}</tbody>,
      tr: ({ children, ...props }: any) => <tr className="hover:bg-slate-50 transition-colors" {...props}>{children}</tr>,
      th: ({ children, ...props }: any) => <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider" {...props}>{process(children)}</th>,
      td: ({ children, ...props }: any) => <td className="px-4 py-3 text-sm text-slate-700" {...props}>{process(children)}</td>,
      
      // Inline elements
      strong: ({ children, ...props }: any) => <strong className="font-bold text-slate-900" {...props}>{process(children)}</strong>,
      em: ({ children, ...props }: any) => <em className="italic" {...props}>{process(children)}</em>,
      a: ({ children, ...props }: any) => <a className="text-blue-600 hover:text-blue-800 hover:underline" {...props}>{process(children)}</a>,
      
      // Code - skip latex processing
      code: ({ children, className, ...props }: any) => {
        const isBlock = /language-(\w+)/.test(className || '');
        return isBlock 
            ? <code className={`${className}`} {...props}>{children}</code>
            : <code className="bg-slate-100 text-slate-700 rounded px-1.5 py-0.5 text-sm font-mono border border-slate-200" {...props}>{children}</code>;
      },
      pre: ({ children, ...props }: any) => <pre className="bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm font-mono shadow-inner" {...props}>{children}</pre>
    };
  }, []);

  return (
    <div className="font-serif text-slate-800 analysis-markdown">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]} 
        rehypePlugins={[
          [rehypeKatex, { 
            throwOnError: false, 
            strict: false,
            macros: { "\\overparen": "\\overset{\\frown}{#1}" } 
          }]
        ]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownWithLatex;