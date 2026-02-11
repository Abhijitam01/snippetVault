'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Lazy load CodeMirror
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] rounded-md border border-white/10 bg-black/40 flex items-center justify-center">
      <div className="text-white/40 font-mono text-sm">Loading editor...</div>
    </div>
  ),
});
import { useTheme } from 'next-themes';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
}

export default function CodeEditor({
  value,
  onChange,
  language,
  placeholder,
  className,
  minHeight = '200px',
  maxHeight = '600px',
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const [extensions, setExtensions] = useState<any[]>([]);
  const [theme, setTheme] = useState<any>(undefined);

  useEffect(() => {
    const loadLanguage = async () => {
      const lang = language.toLowerCase();
      let langExtension: any;
      
      try {
        switch (lang) {
          case 'javascript':
          case 'typescript':
            langExtension = (await import('@codemirror/lang-javascript')).javascript;
            break;
          case 'python':
            langExtension = (await import('@codemirror/lang-python')).python;
            break;
          case 'java':
            langExtension = (await import('@codemirror/lang-java')).java;
            break;
          case 'cpp':
          case 'c':
          case 'csharp':
            langExtension = (await import('@codemirror/lang-cpp')).cpp;
            break;
          case 'rust':
            langExtension = (await import('@codemirror/lang-rust')).rust;
            break;
          case 'go':
            langExtension = (await import('@codemirror/lang-go')).go;
            break;
          case 'php':
            langExtension = (await import('@codemirror/lang-php')).php;
            break;
          case 'html':
            langExtension = (await import('@codemirror/lang-html')).html;
            break;
          case 'css':
            langExtension = (await import('@codemirror/lang-css')).css;
            break;
          case 'sql':
            langExtension = (await import('@codemirror/lang-sql')).sql;
            break;
          case 'json':
          case 'yaml':
            langExtension = (await import('@codemirror/lang-json')).json;
            break;
          case 'xml':
            langExtension = (await import('@codemirror/lang-xml')).xml;
            break;
          case 'markdown':
            langExtension = (await import('@codemirror/lang-markdown')).markdown;
            break;
          default:
            langExtension = (await import('@codemirror/lang-javascript')).javascript;
        }
        setExtensions([langExtension()]);
      } catch (error) {
        console.error('Failed to load language:', error);
        const js = (await import('@codemirror/lang-javascript')).javascript;
        setExtensions([js()]);
      }
    };

    const loadTheme = async () => {
      if (resolvedTheme === 'dark') {
        const oneDark = (await import('@codemirror/theme-one-dark')).oneDark;
        setTheme(oneDark);
      } else {
        setTheme(undefined);
      }
    };

    loadLanguage();
    loadTheme();
  }, [language, resolvedTheme]);

  return (
    <div className={className}>
      <Suspense fallback={
        <div className="h-[300px] rounded-md border border-white/10 bg-black/40 flex items-center justify-center">
          <div className="text-white/40 font-mono text-sm">Loading editor...</div>
        </div>
      }>
        <CodeMirror
          value={value}
          height={minHeight}
          minHeight={minHeight}
          maxHeight={maxHeight}
          theme={theme}
          extensions={extensions}
          onChange={onChange}
          placeholder={placeholder}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            highlightSelectionMatches: true,
          }}
          style={{
            fontSize: '14px',
            fontFamily: 'var(--font-mono), Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
          }}
        />
      </Suspense>
    </div>
  );
}

