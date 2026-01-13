import { NextResponse } from 'next/server';
import { SUBSCRIPTION_TIERS } from '@/lib/features';
import { STRIPE_PRICES } from '@/lib/stripe';

export async function GET() {
  try {
    const plans = [
      {
        id: 'free',
        name: SUBSCRIPTION_TIERS.free.name,
        price: SUBSCRIPTION_TIERS.free.price,
        interval: null,
        priceId: null,
        features: [
          `${SUBSCRIPTION_TIERS.free.snippetLimit} snippets`,
          'Public & unlisted snippets',
          'Basic search',
          `${SUBSCRIPTION_TIERS.free.exportsPerMonth} export per month`,
          'Community support',
        ],
        popular: false,
      },
      {
        id: 'pro_monthly',
        name: SUBSCRIPTION_TIERS.pro.name,
        price: SUBSCRIPTION_TIERS.pro.priceMonthly,
        interval: 'month',
        priceId: STRIPE_PRICES.pro_monthly,
        features: [
          'Unlimited snippets',
          'Private snippets',
          'AI code explanations',
          'Advanced search (regex)',
          'Unlimited exports',
          'Analytics dashboard',
          `${SUBSCRIPTION_TIERS.pro.apiCallsPerMonth.toLocaleString()} API calls/month`,
          'Custom themes',
          'Priority support',
        ],
        popular: true,
      },
      {
        id: 'pro_yearly',
        name: `${SUBSCRIPTION_TIERS.pro.name} (Yearly)`,
        price: SUBSCRIPTION_TIERS.pro.priceYearly,
        interval: 'year',
        priceId: STRIPE_PRICES.pro_yearly,
        savings: Math.round(
          ((SUBSCRIPTION_TIERS.pro.priceMonthly * 12 - SUBSCRIPTION_TIERS.pro.priceYearly) /
            (SUBSCRIPTION_TIERS.pro.priceMonthly * 12)) *
            100
        ),
        features: [
          'Everything in Pro Monthly',
          `Save ${Math.round(
            ((SUBSCRIPTION_TIERS.pro.priceMonthly * 12 - SUBSCRIPTION_TIERS.pro.priceYearly) /
              (SUBSCRIPTION_TIERS.pro.priceMonthly * 12)) *
              100
          )}% vs monthly`,
        ],
        popular: false,
      },
      {
        id: 'team',
        name: SUBSCRIPTION_TIERS.team.name,
        price: SUBSCRIPTION_TIERS.team.pricePerUser,
        interval: 'month',
        priceId: STRIPE_PRICES.team,
        perUser: true,
        features: [
          'Everything in Pro',
          'Team workspaces',
          'Shared collections',
          'Role-based permissions',
          `${SUBSCRIPTION_TIERS.team.apiCallsPerMonth.toLocaleString()} API calls/month`,
          'Team analytics',
          'Priority support',
        ],
        popular: false,
      },
      {
        id: 'enterprise',
        name: SUBSCRIPTION_TIERS.enterprise.name,
        price: null,
        interval: null,
        priceId: null,
        custom: true,
        features: [
          'Everything in Team',
          'Self-hosted option',
          'Unlimited API calls',
          'SSO (SAML/OAuth)',
          'Advanced security',
          'Custom integrations',
          'Dedicated support',
          'SLA guarantees',
        ],
        popular: false,
      },
    ];

    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}

