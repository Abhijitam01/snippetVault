import { NextRequest, NextResponse } from 'next/server';
import { stripe, getTierFromPriceId, getStripeSubscription } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

/**
 * Stripe webhook handler
 * Handles subscription lifecycle events
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful checkout
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const subscriptionId = session.subscription as string;

  if (!userId || !subscriptionId) {
    console.error('Missing userId or subscriptionId in checkout session');
    return;
  }

  // Get subscription details from Stripe
  const stripeSubscription = await getStripeSubscription(subscriptionId);
  const priceId = stripeSubscription.items.data[0]?.price.id;
  const tier = priceId ? getTierFromPriceId(priceId) : null;

  if (!tier) {
    console.error('Could not determine tier from price ID:', priceId);
    return;
  }

  // Update user's subscription in database
  await prisma.subscription.update({
    where: { userId },
    data: {
      tier,
      status: 'active',
      stripeCustomerId: stripeSubscription.customer as string,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      billingPeriod: stripeSubscription.items.data[0]?.price.recurring?.interval === 'year' ? 'yearly' : 'monthly',
      currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
    },
  });

  console.log(`Subscription activated for user ${userId}`);
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    // Try to find user by customer ID
    const dbSubscription = await prisma.subscription.findFirst({
      where: { stripeCustomerId: subscription.customer as string },
      select: { userId: true },
    });

    if (!dbSubscription) {
      console.error('Could not find user for subscription:', subscription.id);
      return;
    }
  }

  const priceId = subscription.items.data[0]?.price.id;
  const tier = priceId ? getTierFromPriceId(priceId) : null;

  const status = subscription.status === 'active' || subscription.status === 'trialing'
    ? 'active'
    : subscription.status === 'past_due'
    ? 'past_due'
    : subscription.status === 'canceled'
    ? 'canceled'
    : 'active';

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      ...(tier && { tier }),
      status,
      stripePriceId: priceId || undefined,
      billingPeriod: subscription.items.data[0]?.price.recurring?.interval === 'year' ? 'yearly' : 'monthly',
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
    },
  });

  console.log(`Subscription updated: ${subscription.id}`);
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      tier: 'free',
      status: 'canceled',
      stripeSubscriptionId: null,
      stripePriceId: null,
      billingPeriod: null,
      currentPeriodStart: null,
      currentPeriodEnd: null,
    },
  });

  console.log(`Subscription canceled: ${subscription.id}`);
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;

  if (!subscriptionId) {
    return;
  }

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      status: 'active',
    },
  });

  console.log(`Payment succeeded for subscription: ${subscriptionId}`);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;

  if (!subscriptionId) {
    return;
  }

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      status: 'past_due',
    },
  });

  console.log(`Payment failed for subscription: ${subscriptionId}`);
}

