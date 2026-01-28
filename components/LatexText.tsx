import React, { useMemo } from 'react';
import katex from 'katex';

interface LatexTextProps {
  text: string;
  className?: string;
}

// Heuristic pattern to detect math that isn't wrapped in $...$
const IMPLICIT_MATH_PATTERN = /((?:(?:[\d.]+|[A-Z]+|\\(?:[a-zA-Z]+)(?:\{[^}]*\})?|[=+\-*/%()^><|!\[\]{},:;]|\/\/)\s*)+)/g;

/**
 * Processes a single string string, detecting explicit ($...$) and implicit math,
 * and returns a React Node (array of spans).
 * Does not handle newlines.
 */
export const renderLatexToFragment = (text: string): React.ReactNode => {
  if (!text) return null;

  // Regex to find content between single $ delimiters
  const parts = text.split(/(\$[^$]+\$)/g);

  return parts.map((part, partIndex) => {
    // Case 1: Explicit LaTeX wrapped in $
    if (part.startsWith('$') && part.endsWith('$')) {
      try {
        // Strip the $ delimiters
        const math = part.slice(1, -1);
        const html = katex.renderToString(math, {
          throwOnError: false,
          displayMode: false, // Inline math
          macros: {
            "\\overparen": "\\overset{\\frown}{#1}" 
          }
        });
        return (
          <span
            key={partIndex}
            dangerouslySetInnerHTML={{ __html: html }}
            className="mx-1 text-slate-900 inline-block"
          />
        );
      } catch (e) {
        console.error("KaTeX error:", e);
        return <span key={partIndex} className="text-red-500">{part}</span>;
      }
    }

    // Case 2: Potential implicit math in plain text
    const subParts = part.split(IMPLICIT_MATH_PATTERN);
    
    return (
      <React.Fragment key={partIndex}>
        {subParts.map((subPart, subIdx) => {
          if (subIdx % 2 === 1) {
            // Heuristic validation
            const trimmed = subPart.trim();
            const hasLatexOrEquals = /[\\=]/.test(trimmed);
            const hasDoubleSlash = /\/\//.test(trimmed);
            const hasOperatorAndNumber = /[+\-*/]/.test(trimmed) && /\d/.test(trimmed);
            const isGeometry = /[A-Z]/.test(trimmed) && /[=+\-*/<>]|\/\/|\\/.test(trimmed);

            if ((hasLatexOrEquals || hasOperatorAndNumber || hasDoubleSlash || isGeometry) && trimmed.length > 0) {
              try {
                 const html = katex.renderToString(trimmed, {
                  throwOnError: false,
                  displayMode: false,
                  macros: {
                    "\\overparen": "\\overset{\\frown}{#1}" 
                  }
                });
                return (
                  <span
                    key={`${partIndex}-${subIdx}`}
                    dangerouslySetInnerHTML={{ __html: html }}
                    className="mx-0.5 inline-block"
                  />
                );
              } catch {
                return <span key={`${partIndex}-${subIdx}`}>{subPart}</span>;
              }
            }
          }
          
          return <span key={`${partIndex}-${subIdx}`}>{subPart}</span>;
        })}
      </React.Fragment>
    );
  });
};

const LatexText: React.FC<LatexTextProps> = ({ text, className = '' }) => {
  const renderedContent = useMemo(() => {
    if (!text) return null;

    // Split by newlines first to preserve paragraph structure
    const lines = text.split('\n');

    return lines.map((line, lineIndex) => {
      return (
        <div key={lineIndex} className={`${lineIndex > 0 ? 'mt-2' : ''} leading-relaxed`}>
          {renderLatexToFragment(line)}
        </div>
      );
    });
  }, [text]);

  return <div className={`font-serif text-slate-800 ${className}`}>{renderedContent}</div>;
};

export default LatexText;