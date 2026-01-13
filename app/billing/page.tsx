'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import MainLayout from '@/components/layout/MainLayout';
import PricingCards from '@/components/billing/PricingCards';
import UsageProgress from '@/components/billing/UsageProgress';
import Button from '@/components/ui/Button';
import { CreditCard, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Category } from '@/types';

interface Plan {
  id: string;
  name: string;
  price: number | null;
  interval: string | null;
  priceId: string | null;
  features: string[];
  popular?: boolean;
  perUser?: boolean;
  custom?: boolean;
  savings?: number;
}

interface UsageStats {
  tier: string;
  snippetCount: number;
  snippetLimit: number;
  apiCallsCount: number;
  apiCallsLimit: number;
  exportCount: number;
  exportLimit: number;
  percentages: {
    snippets: number;
    apiCalls: number;
    exports: number;
  };
}

export default function BillingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // Fetch categories for MainLayout
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  // Fetch plans and usage data
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch plans
        const plansRes = await fetch('/api/billing/plans');
        const plansData = await plansRes.json();
        setPlans(plansData.plans || []);

        // Fetch usage stats (we'll create this endpoint)
        const usageRes = await fetch('/api/billing/usage');
        if (usageRes.ok) {
          const usageData = await usageRes.json();
          setUsage(usageData);
        }
      } catch (error) {
        console.error('Error fetching billing data:', error);
        toast.error('Failed to load billing information');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSearch = (query: string) => {
    // Navigate to dashboard with search query
    if (query.trim()) {
      router.push(`/dashboard?search=${encodeURIComponent(query)}`);
    }
  };

  const handleSelectPlan = async (priceId: string) => {
    if (!priceId) return;

    try {
      setCheckoutLoading(true);

      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to start checkout');
      setCheckoutLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setCheckoutLoading(true);

      const response = await fetch('/api/billing/portal', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
      toast.error('Failed to open billing portal');
      setCheckoutLoading(false);
    }
  };

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

  const currentTier = usage?.tier || 'free';
  const isPaidUser = currentTier !== 'free';

  return (
    <MainLayout categories={categories} onSearch={handleSearch}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white font-mono">
              Billing & Subscription
            </h1>
            <p className="mt-1 text-sm text-white/50 font-mono">
              Manage your subscription and view usage statistics.
            </p>
          </div>

          {isPaidUser && (
            <Button
              onClick={handleManageSubscription}
              disabled={checkoutLoading}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Manage Subscription
            </Button>
          )}
        </div>

        {/* Current Plan & Usage */}
        {usage && (
          <section className="rounded-lg border border-white/10 bg-black/40 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white font-mono">
                Current Usage
              </h2>
            </div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2">
              <span className="text-sm font-mono text-blue-400">
                {currentTier === 'free'
                  ? 'Free Plan'
                  : currentTier === 'pro'
                  ? 'Pro Plan'
                  : currentTier === 'team'
                  ? 'Team Plan'
                  : 'Enterprise Plan'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <UsageProgress
                label="Snippets"
                current={usage.snippetCount}
                limit={usage.snippetLimit === -1 ? '∞' : usage.snippetLimit}
                percentage={usage.percentages.snippets}
              />
              <UsageProgress
                label="API Calls (monthly)"
                current={usage.apiCallsCount}
                limit={usage.apiCallsLimit === -1 ? '∞' : usage.apiCallsLimit}
                percentage={usage.percentages.apiCalls}
              />
              <UsageProgress
                label="Exports (monthly)"
                current={usage.exportCount}
                limit={usage.exportLimit === -1 ? '∞' : usage.exportLimit}
                percentage={usage.percentages.exports}
              />
            </div>
          </section>
        )}

        {/* Pricing Plans */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white font-mono">
              {isPaidUser ? 'Available Plans' : 'Choose Your Plan'}
            </h2>
            <p className="text-sm text-white/50 font-mono">
              {isPaidUser
                ? 'Switch to a different plan that fits your needs.'
                : 'Select the plan that best fits your workflow.'}
            </p>
          </div>

          <PricingCards
            plans={plans}
            currentTier={currentTier}
            onSelectPlan={handleSelectPlan}
            loading={checkoutLoading}
          />
        </section>
      </div>
    </MainLayout>
  );
}

