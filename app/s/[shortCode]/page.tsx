import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Code2, Eye, Calendar, User, Globe, Github, Twitter } from 'lucide-react';
import SnippetViewer from '@/components/snippets/SnippetViewer';
import { Metadata } from 'next';

interface PageProps {
  params: {
    shortCode: string;
  };
}

async function getSnippet(shortCode: string) {
  const snippet = await prisma.snippet.findUnique({
    where: { shortCode },
    include: {
      tags: true,
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          bio: true,
          website: true,
          githubUrl: true,
          twitterUrl: true,
        },
      },
    },
  });

  if (!snippet) {
    return null;
  }

  // Only show public and unlisted snippets on share page
  if (snippet.visibility === 'private') {
    return null;
  }

  // Increment view count
  await prisma.snippet.update({
    where: { id: snippet.id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });

  return snippet;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const snippet = await prisma.snippet.findUnique({
    where: { shortCode: params.shortCode },
    select: {
      title: true,
      description: true,
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
    return {
      title: 'Snippet Not Found',
    };
  }

  return {
    title: `${snippet.title} - SnippetVault`,
    description: snippet.description || `Code snippet shared by ${snippet.user.name || snippet.user.username}`,
    openGraph: {
      title: snippet.title,
      description: snippet.description || 'Code snippet shared on SnippetVault',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: snippet.title,
      description: snippet.description || 'Code snippet shared on SnippetVault',
    },
  };
}

export default async function PublicSnippetPage({ params }: PageProps) {
  const snippet = await getSnippet(params.shortCode);

  if (!snippet) {
    notFound();
  }

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(snippet.createdAt));

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-mono text-white/90 hover:text-white transition-colors">
              <Code2 className="w-5 h-5 text-blue-500" />
              <span>SnippetVault</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-sm font-mono text-white/60 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-lg font-medium transition-all h-9 px-4 text-sm font-mono bg-blue-600 text-white hover:bg-blue-700 border border-blue-500/50"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Snippet Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-semibold text-white mb-2 font-mono">
                  {snippet.title}
                </h1>
                {snippet.description && (
                  <p className="text-white/60 font-mono">{snippet.description}</p>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm font-mono">
                <div className="flex items-center gap-2 text-white/60">
                  <Eye className="w-4 h-4" />
                  <span>{snippet.viewCount} views</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span>{formattedDate}</span>
                </div>
              </div>

              {/* Tags */}
              {snippet.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {snippet.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono bg-white/5 text-white/70 border border-white/10"
                      style={tag.color ? { borderColor: tag.color + '40', color: tag.color } : undefined}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Code Viewer */}
            <SnippetViewer snippet={snippet} shareMode variant="codeOnly" />

            {/* Notes and Resources */}
            {(snippet.notes || snippet.resources) && (
              <div className="space-y-4">
                {snippet.notes && (
                  <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                    <h3 className="text-sm font-semibold text-white mb-2 font-mono">Notes</h3>
                    <p className="text-sm text-white/70 font-mono whitespace-pre-wrap">{snippet.notes}</p>
                  </div>
                )}
                {snippet.resources && (
                  <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                    <h3 className="text-sm font-semibold text-white mb-2 font-mono">Resources</h3>
                    <ul className="space-y-2">
                      {(() => {
                        try {
                          const parsed = JSON.parse(snippet.resources);
                          return Array.isArray(parsed) ? parsed : [];
                        } catch {
                          return [];
                        }
                      })().map((url: string, i: number) => (
                        <li key={i}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300 font-mono break-all"
                          >
                            {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Author Info */}
          <div className="space-y-6">
            <div className="rounded-lg border border-white/10 bg-black/40 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white mb-4 font-mono">Author</h3>
              
              <div className="flex items-start gap-3">
                {snippet.user.avatar ? (
                  <img
                    src={snippet.user.avatar}
                    alt={snippet.user.name || snippet.user.username || 'User'}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {snippet.user.username ? (
                    <Link
                      href={`/${snippet.user.username}`}
                      className="text-white font-mono hover:text-blue-400 transition-colors"
                    >
                      {snippet.user.name || snippet.user.username}
                    </Link>
                  ) : (
                    <p className="text-white font-mono">{snippet.user.name || 'Anonymous'}</p>
                  )}
                  {snippet.user.username && (
                    <p className="text-sm text-white/60 font-mono">@{snippet.user.username}</p>
                  )}
                </div>
              </div>

              {snippet.user.bio && (
                <p className="text-sm text-white/70 font-mono">{snippet.user.bio}</p>
              )}

              {/* Social Links */}
              <div className="flex flex-col gap-2 pt-2">
                {snippet.user.website && (
                  <a
                    href={snippet.user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors font-mono"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="truncate">Website</span>
                  </a>
                )}
                {snippet.user.githubUrl && (
                  <a
                    href={snippet.user.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors font-mono"
                  >
                    <Github className="w-4 h-4" />
                    <span className="truncate">GitHub</span>
                  </a>
                )}
                {snippet.user.twitterUrl && (
                  <a
                    href={snippet.user.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors font-mono"
                  >
                    <Twitter className="w-4 h-4" />
                    <span className="truncate">Twitter</span>
                  </a>
                )}
              </div>

              {/* View Profile Button */}
              {snippet.user.username && (
                <Link
                  href={`/${snippet.user.username}`}
                  className="block w-full text-center rounded-lg py-2 px-4 text-sm font-mono bg-white/5 text-white hover:bg-white/10 border border-white/10 transition-colors"
                >
                  View Profile
                </Link>
              )}
            </div>

            {/* CTA Box */}
            <div className="rounded-lg border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white font-mono">Create Your Own</h3>
              <p className="text-sm text-white/70 font-mono">
                Start organizing and sharing your code snippets with SnippetVault.
              </p>
              <Link
                href="/auth/signup"
                className="block w-full text-center rounded-lg py-2 px-4 text-sm font-mono bg-blue-600 text-white hover:bg-blue-700 border border-blue-500/50 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

