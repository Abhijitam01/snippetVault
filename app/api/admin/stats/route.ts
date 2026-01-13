import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { SUBSCRIPTION_TIERS } from '@/lib/features';

/**
 * Admin stats endpoint
 * Note: In production, you should add proper admin role checking
 * For now, we'll just require authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(request);

    // TODO: Add admin role check here
    // For demo purposes, we'll allow any authenticated user
    // In production, check if user has admin role:
    // const isAdmin = await checkIsAdmin(user.userId);
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    // Get total users
    const totalUsers = await prisma.user.count();

    // Get users by tier
    const subscriptions = await prisma.subscription.groupBy({
      by: ['tier'],
      _count: true,
    });

    const usersByTier = {
      free: 0,
      pro: 0,
      team: 0,
      enterprise: 0,
    };

    subscriptions.forEach((sub) => {
      const tier = sub.tier as keyof typeof usersByTier;
      usersByTier[tier] = sub._count;
    });

    // Calculate MRR
    const activeSubscriptions = await prisma.subscription.findMany({
      where: {
        status: 'active',
        tier: { not: 'free' },
      },
      select: {
        tier: true,
        billingPeriod: true,
      },
    });

    let monthlyRecurringRevenue = 0;
    activeSubscriptions.forEach((sub) => {
      const tier = sub.tier as keyof typeof SUBSCRIPTION_TIERS;
      const tierConfig = SUBSCRIPTION_TIERS[tier];

      if (tier === 'pro') {
        if (sub.billingPeriod === 'yearly' && 'priceYearly' in tierConfig) {
          monthlyRecurringRevenue += (tierConfig as any).priceYearly / 12;
        } else if ('priceMonthly' in tierConfig) {
          monthlyRecurringRevenue += (tierConfig as any).priceMonthly;
        }
      } else if (tier === 'team' && 'pricePerUser' in tierConfig) {
        monthlyRecurringRevenue += (tierConfig as any).pricePerUser;
      }
      // Enterprise pricing is custom, skip for now
    });

    // Count active subscriptions (non-free)
    const activeSubscriptionsCount = activeSubscriptions.length;

    // Get total snippets
    const totalSnippets = await prisma.snippet.count();

    // Get recent signups (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSignups = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    return NextResponse.json({
      totalUsers,
      usersByTier,
      monthlyRecurringRevenue: Math.round(monthlyRecurringRevenue),
      activeSubscriptions: activeSubscriptionsCount,
      totalSnippets,
      recentSignups,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}

