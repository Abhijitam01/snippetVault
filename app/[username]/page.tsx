import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Code2, MapPin, Link as LinkIcon, Github, Twitter, Calendar, Heart, Eye, GitFork } from 'lucide-react';
import { Metadata } from 'next';

interface PageProps {
  params: {
    username: string;
  };
}

async function getUserProfile(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      email: false, // Don't expose email
      avatar: true,
      bio: true,
      website: true,
      githubUrl: true,
      twitterUrl: true,
      createdAt: true,
      snippets: {
        where: {
          visibility: 'public',
        },
        include: {
          tags: true,
          category: true,
          _count: {
            select: {
              likes: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: {
        select: {
          snippets: {
            where: {
              visibility: 'public',
            },
          },
          likes: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  // Calculate total likes received
  const likesReceived = await prisma.like.count({
    where: {
      snippet: {
        userId: user.id,
        visibility: 'public',
      },
    },
  });

  return {
    ...user,
    likesReceived,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: {
      name: true,
      username: true,
      bio: true,
      avatar: true,
    },
  });

  if (!user) {
    return {
      title: 'User Not Found',
    };
  }

  return {
    title: `${user.name || user.username} - SnippetVault`,
    description: user.bio || `Check out ${user.name || user.username}'s code snippets on SnippetVault`,
    openGraph: {
      title: `${user.name || user.username}`,
      description: user.bio || `Code snippets by ${user.name || user.username}`,
      images: user.avatar ? [user.avatar] : undefined,
    },
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const userProfile = await getUserProfile(params.username);

  if (!userProfile) {
    notFound();
  }

  const memberSince = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
  }).format(new Date(userProfile.createdAt));

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

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Avatar and Basic Info */}
          <div className="flex-shrink-0">
            {userProfile.avatar ? (
              <img
                src={userProfile.avatar}
                alt={userProfile.name || userProfile.username || 'User'}
                className="w-32 h-32 rounded-full border-2 border-white/10"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-500/20 flex items-center justify-center border-2 border-white/10">
                <span className="text-4xl font-mono text-blue-400">
                  {(userProfile.name || userProfile.username || 'U')[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 font-mono">
                {userProfile.name || userProfile.username}
              </h1>
              <p className="text-lg text-white/60 font-mono">@{userProfile.username}</p>
            </div>

            {userProfile.bio && (
              <p className="text-white/80 text-lg font-mono max-w-2xl">{userProfile.bio}</p>
            )}

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-white/60 font-mono">
                <Calendar className="w-4 h-4" />
                <span>Joined {memberSince}</span>
              </div>
              {userProfile.website && (
                <a
                  href={userProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-mono transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Website</span>
                </a>
              )}
              {userProfile.githubUrl && (
                <a
                  href={userProfile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-mono transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {userProfile.twitterUrl && (
                <a
                  href={userProfile.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-mono transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  <span>Twitter</span>
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white font-mono">{userProfile._count.snippets}</div>
                  <div className="text-sm text-white/60 font-mono">Snippets</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white font-mono">{userProfile.likesReceived}</div>
                  <div className="text-sm text-white/60 font-mono">Likes Received</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Snippets Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white font-mono">Public Snippets</h2>
            <span className="text-sm text-white/60 font-mono">
              {userProfile.snippets.length} snippet{userProfile.snippets.length !== 1 ? 's' : ''}
            </span>
          </div>

          {userProfile.snippets.length === 0 ? (
            <div className="text-center py-12 rounded-lg border border-white/10 bg-black/40">
              <Code2 className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60 font-mono">No public snippets yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProfile.snippets.map((snippet) => (
                <Link
                  key={snippet.id}
                  href={`/s/${snippet.shortCode}`}
                  className="group block rounded-lg border border-white/10 bg-black/40 p-6 hover:border-blue-500/50 hover:bg-black/60 transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors font-mono line-clamp-2">
                        {snippet.title}
                      </h3>
                      {snippet.isFavorite && <span className="text-yellow-400">⭐</span>}
                    </div>

                    {snippet.description && (
                      <p className="text-sm text-white/60 font-mono line-clamp-2">{snippet.description}</p>
                    )}

                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {snippet.language}
                      </span>
                      {snippet.category && (
                        <span className="px-2 py-1 rounded bg-white/5 text-white/70 border border-white/10">
                          {snippet.category.icon} {snippet.category.name}
                        </span>
                      )}
                    </div>

                    {snippet.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {snippet.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/60 border border-white/10 font-mono"
                          >
                            {tag.name}
                          </span>
                        ))}
                        {snippet.tags.length > 3 && (
                          <span className="text-xs px-2 py-0.5 text-white/60 font-mono">
                            +{snippet.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-2 text-xs text-white/50 font-mono">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        <span>{snippet._count.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{snippet.viewCount}</span>
                      </div>
                      {snippet.forkedCount > 0 && (
                        <div className="flex items-center gap-1">
                          <GitFork className="w-3.5 h-3.5" />
                          <span>{snippet.forkedCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

