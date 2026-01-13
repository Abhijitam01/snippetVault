'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import StatsCard from '@/components/ui/StatsCard';
import { cn } from '@/lib/utils';
import { Code2, FolderTree, Tag as TagIcon, Star, Sparkles, Zap, Lock, Search, FileText, Download, Upload, Palette, Keyboard } from 'lucide-react';
import PublicSnippets from '@/components/home/PublicSnippets';
import Logo from '@/components/ui/Logo';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen flex flex-col bg-black">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-mono text-white/90 hover:text-white transition-colors">
              <Logo size={20} />
              <span>SnippetVault</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm font-mono">
              {user ? (
                <Link
                  href="/dashboard"
                  className={cn(
                    'inline-flex items-center justify-center rounded-lg font-medium transition-all',
                    'h-9 px-4 text-sm',
                    'border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20'
                  )}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="text-white/60 hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className={cn(
                      'inline-flex items-center justify-center rounded-lg font-medium transition-all',
                      'h-9 px-4 text-sm',
                      'bg-blue-600 text-white hover:bg-blue-700 border border-blue-500/50'
                    )}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <section className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-8 py-20 lg:py-32">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-center">
          {/* Left Column - Main Content */}
          <div className="flex-1 space-y-8 max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-blue-400" />
              <span className="text-xs font-mono text-white/70">Minimal snippet vault for developers</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-white leading-tight font-mono">
                Your code snippets,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  organized
                </span>{' '}
                and searchable
              </h1>
              <p className="text-lg text-white/60 font-mono leading-relaxed max-w-xl">
                A minimal, developer-focused snippet manager. No clutter, no teams—just you and your code.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={user ? '/dashboard' : '/auth/signup'}
                className={cn(
                  'inline-flex items-center justify-center rounded-lg font-medium transition-all',
                  'h-11 px-6 text-base font-mono',
                  'bg-blue-600 text-white hover:bg-blue-700 border border-blue-500/50 shadow-lg shadow-blue-500/20'
                )}
              >
                {user ? 'Go to dashboard' : 'Get started'}
              </Link>
              {!user && (
                <Link
                  href="/auth/login"
                  className={cn(
                    'inline-flex items-center justify-center rounded-lg font-medium transition-all',
                    'h-11 px-6 text-base font-mono',
                    'border border-white/10 bg-white/5 text-white hover:bg-white/10'
                  )}
                >
                  Sign in
                </Link>
              )}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              <div className="flex items-start gap-3 p-4 rounded-lg border border-white/5 bg-white/5">
                <FolderTree className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-white font-mono mb-1">Organize</div>
                  <div className="text-xs text-white/50 font-mono">By language, category, tags</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border border-white/5 bg-white/5">
                <Zap className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-white font-mono mb-1">Fast search</div>
                  <div className="text-xs text-white/50 font-mono">Instant results</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border border-white/5 bg-white/5">
                <Lock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-white font-mono mb-1">Private</div>
                  <div className="text-xs text-white/50 font-mono">Your data, your vault</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="flex-1 max-w-lg w-full">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/60 to-black/40 p-6 space-y-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <p className="text-xs font-mono text-white/50 uppercase tracking-wider">Overview</p>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white/20"></div>
                  <div className="w-2 h-2 rounded-full bg-white/20"></div>
                  <div className="w-2 h-2 rounded-full bg-white/20"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <StatsCard title="Snippets" value={5} icon={<Code2 className="w-4 h-4" />} />
                <StatsCard title="Categories" value={3} icon={<FolderTree className="w-4 h-4" />} />
                <StatsCard title="Tags" value={4} icon={<TagIcon className="w-4 h-4" />} />
                <StatsCard title="Favorites" value={3} icon={<Star className="w-4 h-4" />} />
              </div>
              <div className="rounded-lg border border-dashed border-white/10 bg-black/40 px-4 py-3">
                <p className="text-xs font-mono text-white/50">
                  // Search, filter, and access snippets instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto w-full px-6 lg:px-8 py-20 lg:py-32 border-t border-white/5">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-blue-400" />
            <span className="text-xs font-mono text-white/70">Simple workflow</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-4 font-mono">
            How it works
          </h2>
          <p className="text-lg text-white/60 font-mono max-w-2xl mx-auto">
            Three simple steps to organize and access your code snippets
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="group relative">
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-black/60 to-black/40 p-8 h-full transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-sm font-mono text-blue-400 mb-2">Step 1</div>
                <h3 className="text-xl font-semibold text-white mb-3 font-mono">Create</h3>
                <p className="text-white/60 font-mono text-sm leading-relaxed">
                  Add your code snippets with title, language, tags, and optional notes. Organize them into categories for easy access.
                </p>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-black/60 to-black/40 p-8 h-full transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Search className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-sm font-mono text-blue-400 mb-2">Step 2</div>
                <h3 className="text-xl font-semibold text-white mb-3 font-mono">Search</h3>
                <p className="text-white/60 font-mono text-sm leading-relaxed">
                  Use lightning-fast search to find snippets by query, language, category, or tags. Filter and access your code in seconds.
                </p>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-black/60 to-black/40 p-8 h-full transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Code2 className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-sm font-mono text-blue-400 mb-2">Step 3</div>
                <h3 className="text-xl font-semibold text-white mb-3 font-mono">Reuse</h3>
                <p className="text-white/60 font-mono text-sm leading-relaxed">
                  Copy your snippets with one click, edit when needed, and keep your favorites starred for quick access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="max-w-7xl mx-auto w-full px-6 lg:px-8 py-20 lg:py-32 border-t border-white/5">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-6">
            <Star className="w-3.5 h-3.5 mr-2 text-blue-400" />
            <span className="text-xs font-mono text-white/70">Why choose SnippetVault</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-4 font-mono">
            Built for developers
          </h2>
          <p className="text-lg text-white/60 font-mono max-w-2xl mx-auto">
            Everything you need, nothing you don't
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group rounded-xl border border-white/10 bg-black/40 p-6 transition-all duration-300 hover:border-blue-500/50 hover:bg-black/60">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Palette className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 font-mono">Syntax Highlighting</h3>
                <p className="text-sm text-white/60 font-mono leading-relaxed">
                  Beautiful code highlighting for 20+ languages powered by Prism.js
                </p>
              </div>
            </div>
          </div>

          <div className="group rounded-xl border border-white/10 bg-black/40 p-6 transition-all duration-300 hover:border-blue-500/50 hover:bg-black/60">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Keyboard className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 font-mono">Keyboard Friendly</h3>
                <p className="text-sm text-white/60 font-mono leading-relaxed">
                  Navigate and search with keyboard shortcuts. Built for power users.
                </p>
              </div>
            </div>
          </div>

          <div className="group rounded-xl border border-white/10 bg-black/40 p-6 transition-all duration-300 hover:border-blue-500/50 hover:bg-black/60">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Download className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 font-mono">Export & Import</h3>
                <p className="text-sm text-white/60 font-mono leading-relaxed">
                  Backup your snippets as JSON. No vendor lock-in. Your data, your control.
                </p>
              </div>
            </div>
          </div>

          <div className="group rounded-xl border border-white/10 bg-black/40 p-6 transition-all duration-300 hover:border-blue-500/50 hover:bg-black/60">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <TagIcon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 font-mono">Smart Tags</h3>
                <p className="text-sm text-white/60 font-mono leading-relaxed">
                  Organize with custom tags and categories. Find what you need instantly.
                </p>
              </div>
            </div>
          </div>

          <div className="group rounded-xl border border-white/10 bg-black/40 p-6 transition-all duration-300 hover:border-blue-500/50 hover:bg-black/60">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 font-mono">Favorites</h3>
                <p className="text-sm text-white/60 font-mono leading-relaxed">
                  Star your most-used snippets for quick access. Never lose your go-to code.
                </p>
              </div>
            </div>
          </div>

          <div className="group rounded-xl border border-white/10 bg-black/40 p-6 transition-all duration-300 hover:border-blue-500/50 hover:bg-black/60">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 font-mono">Private & Secure</h3>
                <p className="text-sm text-white/60 font-mono leading-relaxed">
                  Your snippets stay private. Local-first approach with optional cloud sync.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Public Snippets */}
      <section className="max-w-7xl mx-auto w-full px-6 lg:px-8 py-20 lg:py-32 border-t border-white/5">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-6">
            <Code2 className="w-3.5 h-3.5 mr-2 text-blue-400" />
            <span className="text-xs font-mono text-white/70">Explore</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-4 font-mono">
            Recent Code Snippets
          </h2>
          <p className="text-lg text-white/60 font-mono max-w-2xl mx-auto">
            Discover and learn from code shared by the community
          </p>
        </div>

        <PublicSnippets />

        <div className="text-center mt-12">
          <Link
            href="/auth/signup"
            className={cn(
              'inline-flex items-center justify-center rounded-lg font-medium transition-all',
              'h-11 px-6 text-base font-mono',
              'bg-blue-600 text-white hover:bg-blue-700 border border-blue-500/50 shadow-lg shadow-blue-500/20'
            )}
          >
            Join SnippetVault →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono text-white/40">
              built by one dev · v0.1
            </p>
            <div className="flex items-center gap-6 text-xs font-mono text-white/40">
              <Link href="/dashboard" className="hover:text-white/60 transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
