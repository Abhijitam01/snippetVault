import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

interface PageProps {
  params: {
    shortCode: string;
  };
  searchParams: {
    theme?: 'dark' | 'light';
  };
}

async function getSnippet(shortCode: string) {
  const snippet = await prisma.snippet.findUnique({
    where: { shortCode },
    select: {
      id: true,
      title: true,
      code: true,
      language: true,
      visibility: true,
      user: {
        select: {
          name: true,
          username: true,
        },
      },
    },
  });

  if (!snippet || snippet.visibility === 'private') {
    return null;
  }

  return snippet;
}

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function EmbedPage({ params, searchParams }: PageProps) {
  const snippet = await getSnippet(params.shortCode);

  if (!snippet) {
    notFound();
  }

  const theme = searchParams.theme || 'dark';
  const isDark = theme === 'dark';

  return (
    <html lang="en" className={isDark ? 'dark' : ''}>
      <head>
        <link rel="stylesheet" href="/prism-themes/prism-one-dark.css" />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            background: ${isDark ? '#0d1117' : '#ffffff'};
            color: ${isDark ? '#e6edf3' : '#24292f'};
            overflow: hidden;
          }
          .embed-container {
            height: 100vh;
            display: flex;
            flex-direction: column;
          }
          .embed-header {
            padding: 12px 16px;
            border-bottom: 1px solid ${isDark ? '#30363d' : '#d0d7de'};
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: ${isDark ? '#0d1117' : '#f6f8fa'};
          }
          .embed-title {
            font-size: 14px;
            font-weight: 600;
            color: ${isDark ? '#e6edf3' : '#24292f'};
            margin: 0;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .embed-lang {
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 12px;
            background: ${isDark ? '#1f6feb26' : '#ddf4ff'};
            color: ${isDark ? '#58a6ff' : '#0969da'};
            margin-left: 12px;
          }
          .embed-code {
            flex: 1;
            overflow: auto;
            padding: 16px;
          }
          pre {
            margin: 0;
            background: ${isDark ? '#161b22' : '#f6f8fa'} !important;
            border-radius: 6px;
            padding: 16px;
          }
          code {
            font-size: 13px;
            line-height: 1.6;
          }
          .embed-footer {
            padding: 8px 16px;
            border-top: 1px solid ${isDark ? '#30363d' : '#d0d7de'};
            font-size: 11px;
            color: ${isDark ? '#7d8590' : '#57606a'};
            text-align: center;
            background: ${isDark ? '#0d1117' : '#f6f8fa'};
          }
          .embed-footer a {
            color: ${isDark ? '#58a6ff' : '#0969da'};
            text-decoration: none;
          }
          .embed-footer a:hover {
            text-decoration: underline;
          }
        `}</style>
      </head>
      <body>
        <div className="embed-container">
          <div className="embed-header">
            <h2 className="embed-title">{snippet.title}</h2>
            <span className="embed-lang">{snippet.language}</span>
          </div>
          <div className="embed-code">
            <pre>
              <code className={`language-${snippet.language.toLowerCase()}`}>
                {snippet.code}
              </code>
            </pre>
          </div>
          <div className="embed-footer">
            <a
              href={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/s/${params.shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on SnippetVault
            </a>
            {' '} · Shared by {snippet.user.name || snippet.user.username}
          </div>
        </div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
        <script src={`https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${snippet.language.toLowerCase()}.min.js`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof Prism !== 'undefined') {
                Prism.highlightAll();
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

