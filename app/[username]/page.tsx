'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Code2, Globe, Github, Twitter, User as UserIcon } from 'lucide-react';
import SnippetList from '@/components/snippets/SnippetList';

type PublicProfileUser = {
  id: string;
  name: string | null;
  username: string | null;
  bio: string | null;
  avatar: string | null;
  website: string | null;
  githubUrl: string | null;
  twitterUrl: string | null;
  createdAt: string;
};

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const username = useMemo(() => (params?.username ? String(params.username) : ''), [params]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<{
    user: PublicProfileUser;
    snippets: any[];
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setLoading(true);
        setError(null);
        setProfile(null);

        const res = await fetch(`/api/public/profile/${encodeURIComponent(username)}`);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.error || 'Failed to load profile');
        }

        if (!cancelled) {
          setProfile(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load profile');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (username) run();
    return () => {
      cancelled = true;
    };
  }, [username]);

  return (
    <main className="min-h-screen bg-black">
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

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {loading && (
          <div className="text-white/60 font-mono">Loading profile…</div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-400 font-mono">{error}</p>
          </div>
        )}

        {!loading && !error && profile?.user && (
          <div className="space-y-8">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                {profile.user.avatar ? (
                  <img
                    src={profile.user.avatar}
                    alt={profile.user.name || profile.user.username || 'User'}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-blue-400" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl font-semibold text-white font-mono truncate">
                    {profile.user.name || profile.user.username}
                  </h1>
                  {profile.user.username && (
                    <p className="text-sm text-white/60 font-mono">@{profile.user.username}</p>
                  )}
                  {profile.user.bio && (
                    <p className="mt-3 text-sm text-white/70 font-mono whitespace-pre-wrap">
                      {profile.user.bio}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-3">
                    {profile.user.website && (
                      <a
                        href={profile.user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-mono text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Website
                      </a>
                    )}
                    {profile.user.githubUrl && (
                      <a
                        href={profile.user.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-mono text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {profile.user.twitterUrl && (
                      <a
                        href={profile.user.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-mono text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                        Twitter / X
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white font-mono">Public snippets</h2>
                <p className="text-sm text-white/50 font-mono">
                  {Array.isArray(profile.snippets) ? profile.snippets.length : 0}
                </p>
              </div>

              <SnippetList snippets={(profile.snippets || []) as any} loading={false} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


