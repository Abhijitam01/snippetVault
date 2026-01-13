import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { createCheckoutSession, STRIPE_PRICES } from '@/lib/stripe';
import { z } from 'zod';

const checkoutSchema = z.object({
  priceId: z.enum([
    STRIPE_PRICES.pro_monthly,
    STRIPE_PRICES.pro_yearly,
    STRIPE_PRICES.team,
  ]),
});

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(request);

    const body = await request.json();
    const { priceId } = checkoutSchema.parse(body);

    // Create checkout session
    const session = await createCheckoutSession(
      user.userId,
      user.email,
      priceId,
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/billing?success=true`,
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/billing?canceled=true`
    );

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

