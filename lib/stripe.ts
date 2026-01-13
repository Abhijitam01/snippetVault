/**
 * Stripe utility for payment processing
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia',
  typescript: true,
});

/**
 * Stripe Price IDs (set these in environment variables)
 */
export const STRIPE_PRICES = {
  pro_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || '',
  pro_yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || '',
  team: process.env.STRIPE_TEAM_PRICE_ID || '',
} as const;

/**
 * Create or retrieve a Stripe customer for a user
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string | null
): Promise<string> {
  const { prisma } = await import('@/lib/prisma');

  // Check if user already has a Stripe customer ID
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { stripeCustomerId: true },
  });

  if (subscription?.stripeCustomerId) {
    return subscription.stripeCustomerId;
  }

  // Create a new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      userId,
    },
  });

  // Update subscription record with customer ID
  await prisma.subscription.update({
    where: { userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(
  userId: string,
  email: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  const customerId = await getOrCreateStripeCustomer(userId, email);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      metadata: {
        userId,
      },
    },
    metadata: {
      userId,
    },
  });

  return session;
}

/**
 * Create a billing portal session
 */
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

/**
 * Get subscription details from Stripe
 */
export async function getStripeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

/**
 * Resume a subscription
 */
export async function resumeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

/**
 * Map Stripe price ID to subscription tier
 */
export function getTierFromPriceId(priceId: string): 'pro' | 'team' | null {
  if (priceId === STRIPE_PRICES.pro_monthly || priceId === STRIPE_PRICES.pro_yearly) {
    return 'pro';
  }
  if (priceId === STRIPE_PRICES.team) {
    return 'team';
  }
  return null;
}

