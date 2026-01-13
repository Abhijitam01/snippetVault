'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

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

interface PricingCardsProps {
  plans: Plan[];
  currentTier?: string;
  onSelectPlan: (priceId: string) => void;
  loading?: boolean;
}

export default function PricingCards({
  plans,
  currentTier = 'free',
  onSelectPlan,
  loading = false,
}: PricingCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => {
        const isCurrentPlan = plan.id.startsWith(currentTier);
        const isFree = plan.id === 'free';
        const isEnterprise = plan.id === 'enterprise';

        return (
          <div
            key={plan.id}
            className={cn(
              'relative rounded-xl border bg-black/40 p-6 transition-all duration-300',
              plan.popular
                ? 'border-blue-500/50 shadow-xl shadow-blue-500/10'
                : 'border-white/10 hover:border-white/20'
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white font-mono">
                Most Popular
              </div>
            )}

            {plan.savings && (
              <div className="absolute -top-3 right-4 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white font-mono">
                Save {plan.savings}%
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white font-mono mb-2">
                {plan.name}
              </h3>

              <div className="flex items-baseline gap-1">
                {plan.custom ? (
                  <span className="text-3xl font-bold text-white font-mono">
                    Custom
                  </span>
                ) : plan.price === null || plan.price === 0 ? (
                  <span className="text-3xl font-bold text-white font-mono">
                    Free
                  </span>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-white font-mono">
                      ${plan.price}
                    </span>
                    <span className="text-white/60 font-mono text-sm">
                      {plan.perUser && '/user'}
                      {plan.interval && `/${plan.interval}`}
                    </span>
                  </>
                )}
              </div>
            </div>

            <ul className="mb-6 space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-white/80 font-mono">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => {
                if (plan.priceId) {
                  onSelectPlan(plan.priceId);
                }
              }}
              disabled={loading || isFree || isCurrentPlan || !plan.priceId}
              variant={plan.popular ? 'primary' : 'secondary'}
              className="w-full"
            >
              {isCurrentPlan
                ? 'Current Plan'
                : isFree
                ? 'Get Started'
                : isEnterprise
                ? 'Contact Sales'
                : 'Upgrade'}
            </Button>
          </div>
        );
      })}
    </div>
  );
}

