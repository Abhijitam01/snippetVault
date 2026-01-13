# Freemium Business Model - Setup Guide

This guide explains how to set up and configure the freemium subscription system for SnippetVault.

## Overview

The freemium business model has been successfully implemented with the following features:

### Subscription Tiers

1. **Free Tier**
   - 50 snippets max
   - Public & unlisted snippets only
   - Basic search
   - 1 export per month
   - Community support

2. **Pro Tier ($7/month or $70/year)**
   - Unlimited snippets
   - Private snippets
   - AI code explanations
   - Advanced search (regex)
   - Unlimited exports
   - Analytics dashboard
   - 1,000 API calls/month
   - Custom themes
   - Priority support

3. **Team Tier ($15/user/month)**
   - Everything in Pro
   - Team workspaces
   - Shared collections
   - Role-based permissions
   - 10,000 API calls/month
   - Team analytics

4. **Enterprise Tier (Custom Pricing)**
   - Everything in Team
   - Self-hosted option
   - Unlimited API calls
   - SSO (SAML/OAuth)
   - Advanced security
   - Custom integrations
   - Dedicated support
   - SLA guarantees

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/snippetvault"

# Authentication
JWT_SECRET="your-secret-key-here"

# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Stripe Price IDs
STRIPE_PRO_MONTHLY_PRICE_ID="price_..."
STRIPE_PRO_YEARLY_PRICE_ID="price_..."
STRIPE_TEAM_PRICE_ID="price_..."

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Setup Instructions

### 1. Database Migration

Run Prisma migration to create the new subscription tables:

```bash
pnpm exec prisma migrate dev --name add-subscription-models
```

This will create:
- `Subscription` table for managing user subscriptions
- `UsageTracking` table for monitoring quotas

### 2. Stripe Configuration

#### Create Products in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Products** → **Add Product**
3. Create the following products:

**Pro Monthly**
- Name: "SnippetVault Pro (Monthly)"
- Price: $7.00 USD
- Billing: Recurring monthly
- Copy the Price ID to `STRIPE_PRO_MONTHLY_PRICE_ID`

**Pro Yearly**
- Name: "SnippetVault Pro (Yearly)"
- Price: $70.00 USD
- Billing: Recurring yearly
- Copy the Price ID to `STRIPE_PRO_YEARLY_PRICE_ID`

**Team**
- Name: "SnippetVault Team"
- Price: $15.00 USD per user
- Billing: Recurring monthly
- Copy the Price ID to `STRIPE_TEAM_PRICE_ID`

#### Configure Webhook

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/billing/webhooks`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** to `STRIPE_WEBHOOK_SECRET`

### 3. Initialize Existing Users

For existing users in your database, run a migration script to create their subscription records:

```bash
pnpm exec tsx prisma/init-subscriptions.ts
```

Create `prisma/init-subscriptions.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  console.log(`Found ${users.length} users`);

  for (const user of users) {
    // Check if subscription already exists
    const existing = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    if (!existing) {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          tier: 'free',
          status: 'active',
        },
      });

      await prisma.usageTracking.create({
        data: {
          userId: user.id,
          snippetCount: 0,
        },
      });

      console.log(`Initialized subscription for user ${user.id}`);
    }
  }

  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### 4. Update Existing Snippet Counts

Update usage tracking with current snippet counts:

```bash
pnpm exec tsx prisma/sync-snippet-counts.ts
```

Create `prisma/sync-snippet-counts.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true },
    include: {
      _count: {
        select: { snippets: true },
      },
    },
  });

  console.log(`Syncing snippet counts for ${users.length} users`);

  for (const user of users) {
    await prisma.usageTracking.upsert({
      where: { userId: user.id },
      update: { snippetCount: user._count.snippets },
      create: {
        userId: user.id,
        snippetCount: user._count.snippets,
      },
    });

    console.log(`User ${user.id}: ${user._count.snippets} snippets`);
  }

  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### 5. Test the Integration

#### Test Checkout Flow

1. Start the development server: `pnpm dev`
2. Sign up for a new account
3. Navigate to `/billing`
4. Click "Upgrade" on Pro plan
5. Use Stripe test card: `4242 4242 4242 4242`
6. Complete checkout
7. Verify subscription is active in `/billing`

#### Test Usage Limits

**Free Tier Limits:**
1. Create 50 snippets
2. Try to create the 51st snippet - should show upgrade prompt
3. Try to create a private snippet - should show upgrade prompt
4. Export once successfully
5. Try to export again - should show limit message

**Pro Tier Features:**
1. After upgrading, verify unlimited snippets work
2. Test private snippet creation
3. Access `/analytics` dashboard
4. Test unlimited exports

#### Test Webhooks Locally

Use Stripe CLI for local testing:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/billing/webhooks

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

## Implementation Details

### Files Created/Modified

**Database Schema:**
- `prisma/schema.prisma` - Added Subscription and UsageTracking models

**Feature Gates:**
- `lib/features.ts` - Subscription tier configs and feature checking
- `lib/middleware/usage.ts` - Usage enforcement middleware
- `lib/stripe.ts` - Stripe utility functions

**API Routes:**
- `app/api/billing/create-checkout/route.ts` - Create checkout session
- `app/api/billing/portal/route.ts` - Customer portal access
- `app/api/billing/webhooks/route.ts` - Stripe webhook handler
- `app/api/billing/plans/route.ts` - Fetch available plans
- `app/api/billing/usage/route.ts` - Get user usage stats
- `app/api/analytics/route.ts` - Pro tier analytics
- `app/api/admin/stats/route.ts` - Admin business metrics

**Updated API Routes:**
- `app/api/snippets/route.ts` - Enforces snippet limits
- `app/api/snippets/[id]/route.ts` - Checks private snippet access
- `app/api/export/route.ts` - Enforces export limits
- `app/api/auth/signup/route.ts` - Initializes free tier subscription

**UI Components:**
- `components/billing/PricingCards.tsx` - Pricing display
- `components/billing/UsageProgress.tsx` - Usage bars
- `components/billing/UpgradeBanner.tsx` - Upgrade prompts

**Pages:**
- `app/billing/page.tsx` - Subscription management
- `app/analytics/page.tsx` - Pro tier analytics
- `app/admin/page.tsx` - Admin dashboard

## Revenue Projections

Based on industry benchmarks:

| Timeline | Free Users | Paid Users (5% conversion) | MRR | ARR |
|----------|-----------|----------------------------|-----|-----|
| 3 months | 500 | 25 | $625 | $7,500 |
| 6 months | 1,000 | 50 | $1,250 | $15,000 |
| 12 months | 5,000 | 250 | $6,250 | $75,000 |
| 24 months | 15,000 | 750 | $18,750 | $225,000 |

*Assumptions: $7/month average (mix of monthly/yearly), 5% free-to-paid conversion*

## Marketing & Growth Tips

1. **Free Trial**: Offer 14-day Pro trial for new signups
2. **Usage Notifications**: Email users at 80% of their quota
3. **Upgrade Prompts**: Show contextual upgrade banners
4. **Annual Discount**: 17% savings on yearly plan drives conversions
5. **Feature Comparison**: Clear pricing page showing tier differences
6. **Social Proof**: Display testimonials from paid users
7. **Limited Time Offers**: Launch discounts for early adopters

## Monitoring & Metrics

Track these key metrics in `/admin`:
- **MRR (Monthly Recurring Revenue)**: Total monthly subscription revenue
- **Churn Rate**: Percentage of users canceling subscriptions
- **Conversion Rate**: Free to paid user conversion percentage
- **CAC (Customer Acquisition Cost)**: Marketing spend / new customers
- **LTV (Lifetime Value)**: Average revenue per customer over lifetime
- **Trial Conversion**: % of trial users converting to paid

## Security Considerations

1. **Webhook Signature Verification**: All webhooks verify Stripe signature
2. **Rate Limiting**: Consider adding rate limiting to API routes
3. **Admin Access Control**: Currently any authenticated user can access `/admin` - implement proper role-based access control in production
4. **Data Privacy**: Private snippets are only visible to owners
5. **Payment Security**: All payment processing handled by Stripe PCI-compliant infrastructure

## Support & Documentation

- Stripe Documentation: https://stripe.com/docs
- Webhook Testing: https://stripe.com/docs/webhooks/test
- Price API: https://stripe.com/docs/api/prices

## Next Steps

1. **Launch Marketing Site**: Create landing page with clear value proposition
2. **Email System**: Set up transactional emails (welcome, payment, limits)
3. **Customer Support**: Integrate help desk (Intercom, Zendesk)
4. **Analytics**: Add proper analytics tracking (Mixpanel, Amplitude)
5. **A/B Testing**: Test pricing tiers and feature positioning
6. **Referral Program**: Incentivize users to invite friends
7. **Content Marketing**: Blog about code snippet best practices

---

## Questions or Issues?

If you encounter any problems during setup, check:
1. Stripe webhooks are properly configured
2. Environment variables are set correctly
3. Database migrations have run successfully
4. Stripe test mode is enabled during development

