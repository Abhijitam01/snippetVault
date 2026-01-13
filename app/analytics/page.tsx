'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import MainLayout from '@/components/layout/MainLayout';
import StatsCard from '@/components/ui/StatsCard';
import { TrendingUp, Eye, Heart, Code2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import UpgradeBanner from '@/components/billing/UpgradeBanner';

interface AnalyticsData {
  totalViews: number;
  totalLikes: number;
  totalSnippets: number;
  mostViewedSnippets: Array<{
    id: string;
    title: string;
    language: string;
    viewCount: number;
    createdAt: string;
  }>;
  mostLikedSnippets: Array<{
    id: string;
    title: string;
    language: string;
    likeCount: number;
  }>;
  recentActivity: Array<{
    date: string;
    views: number;
    likes: number;
  }>;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [hasAccess, setHasAccess] = useState(true);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // Fetch analytics data
  useEffect(() => {
    if (!user) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/analytics');

        if (response.status === 403) {
          setHasAccess(false);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const data = await response.json();
        setAnalytics(data);
        setHasAccess(true);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  // Show loading while checking auth
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  // If not authenticated, return null (redirect will happen via useEffect)
  if (!user) {
    return null;
  }

  // If user doesn't have access, show upgrade banner
  if (!hasAccess) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-white font-mono">
              Analytics Dashboard
            </h1>
            <p className="mt-1 text-sm text-white/50 font-mono">
              Insights and statistics about your code snippets.
            </p>
          </div>

          <UpgradeBanner
            message="Analytics are only available on the Pro plan and above. Upgrade to unlock detailed insights about your snippets."
            ctaText="Upgrade to Pro"
            dismissible={false}
          />

          <div className="rounded-lg border border-white/10 bg-black/40 p-12 text-center">
            <TrendingUp className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white/40 font-mono mb-2">
              Pro Feature
            </h3>
            <p className="text-sm text-white/30 font-mono">
              Upgrade to access analytics and insights.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!analytics) {
    return (
      <MainLayout>
        <div className="text-center text-white/50 font-mono">
          No analytics data available.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-white font-mono">
            Analytics Dashboard
          </h1>
          <p className="mt-1 text-sm text-white/50 font-mono">
            Insights and statistics about your code snippets.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Total Views"
            value={analytics.totalViews}
            icon={<Eye className="w-4 h-4" />}
          />
          <StatsCard
            title="Total Likes"
            value={analytics.totalLikes}
            icon={<Heart className="w-4 h-4" />}
          />
          <StatsCard
            title="Total Snippets"
            value={analytics.totalSnippets}
            icon={<Code2 className="w-4 h-4" />}
          />
        </div>

        {/* Most Viewed Snippets */}
        <section className="rounded-lg border border-white/10 bg-black/40 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white font-mono">
              Most Viewed Snippets
            </h2>
          </div>

          {analytics.mostViewedSnippets.length === 0 ? (
            <p className="text-sm text-white/50 font-mono">
              No snippets with views yet.
            </p>
          ) : (
            <div className="space-y-3">
              {analytics.mostViewedSnippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-black/40 hover:border-white/10 transition-colors cursor-pointer"
                  onClick={() => router.push(`/snippets/${snippet.id}`)}
                >
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-white font-mono">
                      {snippet.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/50 font-mono">
                        {snippet.language}
                      </span>
                      <span className="text-xs text-white/30">•</span>
                      <span className="text-xs text-white/50 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(snippet.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-blue-400">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-mono">
                      {snippet.viewCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Most Liked Snippets */}
        <section className="rounded-lg border border-white/10 bg-black/40 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-semibold text-white font-mono">
              Most Liked Snippets
            </h2>
          </div>

          {analytics.mostLikedSnippets.length === 0 ? (
            <p className="text-sm text-white/50 font-mono">
              No snippets with likes yet.
            </p>
          ) : (
            <div className="space-y-3">
              {analytics.mostLikedSnippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-black/40 hover:border-white/10 transition-colors cursor-pointer"
                  onClick={() => router.push(`/snippets/${snippet.id}`)}
                >
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-white font-mono">
                      {snippet.title}
                    </h3>
                    <span className="text-xs text-white/50 font-mono">
                      {snippet.language}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-red-400">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm font-mono">
                      {snippet.likeCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}

