'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import MainLayout from '@/components/layout/MainLayout';
import StatsCard from '@/components/ui/StatsCard';
import { Users, DollarSign, TrendingUp, Award } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminStats {
  totalUsers: number;
  usersByTier: {
    free: number;
    pro: number;
    team: number;
    enterprise: number;
  };
  monthlyRecurringRevenue: number;
  activeSubscriptions: number;
  totalSnippets: number;
  recentSignups: number; // Last 30 days
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // Fetch admin stats
  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/admin/stats');

        if (response.status === 403) {
          setHasAccess(false);
          toast.error('Access denied. Admin privileges required.');
          router.push('/dashboard');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch admin stats');
        }

        const data = await response.json();
        setStats(data);
        setHasAccess(true);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        toast.error('Failed to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, router]);

  // Show loading while checking auth
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  // If not authenticated or no access, return null
  if (!user || !hasAccess) {
    return null;
  }

  if (!stats) {
    return (
      <MainLayout>
        <div className="text-center text-white/50 font-mono">
          No admin data available.
        </div>
      </MainLayout>
    );
  }

  const conversionRate =
    stats.totalUsers > 0
      ? (
          ((stats.totalUsers - stats.usersByTier.free) / stats.totalUsers) *
          100
        ).toFixed(1)
      : '0.0';

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-white font-mono">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-white/50 font-mono">
            Business metrics and platform statistics.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<Users className="w-4 h-4" />}
          />
          <StatsCard
            title="MRR"
            value={`$${stats.monthlyRecurringRevenue.toLocaleString()}`}
            icon={<DollarSign className="w-4 h-4" />}
          />
          <StatsCard
            title="Active Subs"
            value={stats.activeSubscriptions}
            icon={<Award className="w-4 h-4" />}
          />
          <StatsCard
            title="Recent Signups"
            value={stats.recentSignups}
            icon={<TrendingUp className="w-4 h-4" />}
          />
        </div>

        {/* Users by Tier */}
        <section className="rounded-lg border border-white/10 bg-black/40 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white font-mono">
              Users by Subscription Tier
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border border-white/5 bg-black/40">
              <div className="text-2xl font-bold text-white font-mono">
                {stats.usersByTier.free}
              </div>
              <div className="text-sm text-white/50 font-mono mt-1">Free</div>
            </div>
            <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/10">
              <div className="text-2xl font-bold text-blue-400 font-mono">
                {stats.usersByTier.pro}
              </div>
              <div className="text-sm text-blue-300 font-mono mt-1">Pro</div>
            </div>
            <div className="p-4 rounded-lg border border-purple-500/20 bg-purple-500/10">
              <div className="text-2xl font-bold text-purple-400 font-mono">
                {stats.usersByTier.team}
              </div>
              <div className="text-sm text-purple-300 font-mono mt-1">Team</div>
            </div>
            <div className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/10">
              <div className="text-2xl font-bold text-yellow-400 font-mono">
                {stats.usersByTier.enterprise}
              </div>
              <div className="text-sm text-yellow-300 font-mono mt-1">
                Enterprise
              </div>
            </div>
          </div>
        </section>

        {/* Revenue & Growth Metrics */}
        <section className="rounded-lg border border-white/10 bg-black/40 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-semibold text-white font-mono">
              Revenue & Growth
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-white/50 font-mono mb-1">
                Monthly Recurring Revenue
              </div>
              <div className="text-2xl font-bold text-green-400 font-mono">
                ${stats.monthlyRecurringRevenue.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-white/50 font-mono mb-1">
                Annual Run Rate
              </div>
              <div className="text-2xl font-bold text-green-400 font-mono">
                ${(stats.monthlyRecurringRevenue * 12).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-white/50 font-mono mb-1">
                Conversion Rate
              </div>
              <div className="text-2xl font-bold text-blue-400 font-mono">
                {conversionRate}%
              </div>
            </div>
          </div>
        </section>

        {/* Platform Statistics */}
        <section className="rounded-lg border border-white/10 bg-black/40 p-6">
          <h2 className="text-lg font-semibold text-white font-mono mb-4">
            Platform Statistics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-white/5 bg-black/40">
              <div className="text-sm text-white/50 font-mono mb-1">
                Total Snippets
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {stats.totalSnippets.toLocaleString()}
              </div>
            </div>
            <div className="p-4 rounded-lg border border-white/5 bg-black/40">
              <div className="text-sm text-white/50 font-mono mb-1">
                Avg Snippets per User
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {stats.totalUsers > 0
                  ? (stats.totalSnippets / stats.totalUsers).toFixed(1)
                  : '0'}
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

