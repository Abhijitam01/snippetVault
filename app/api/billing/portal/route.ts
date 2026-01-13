import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { createBillingPortalSession } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(request);

    // Get user's Stripe customer ID
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.userId },
      select: { stripeCustomerId: true },
    });

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing account found' },
        { status: 404 }
      );
    }

    // Create billing portal session
    const session = await createBillingPortalSession(
      subscription.stripeCustomerId,
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/billing`
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    );
  }
}

