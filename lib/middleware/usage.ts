/**
 * Usage middleware for API routes
 * Enforces subscription limits and tracks usage
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  canCreateSnippet,
  canExport,
  canMakeApiCall,
  hasFeature,
  incrementSnippetCount,
  incrementExportCount,
  incrementApiCallCount,
  Feature,
} from '@/lib/features';

export interface UsageCheckResult {
  allowed: boolean;
  response?: NextResponse;
  reason?: string;
}

/**
 * Check if user can create a snippet and return appropriate response
 * @param userId User ID
 * @returns UsageCheckResult with allowed status and optional error response
 */
export async function checkSnippetCreation(userId: string): Promise<UsageCheckResult> {
  const result = await canCreateSnippet(userId);

  if (!result.allowed) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: result.reason,
          limit: result.limit,
          currentCount: result.currentCount,
          upgrade: {
            message: 'Upgrade to Pro for unlimited snippets',
            tier: 'pro',
          },
        },
        { status: 403 }
      ),
      reason: result.reason,
    };
  }

  return { allowed: true };
}

/**
 * Track snippet creation (increment counter)
 * @param userId User ID
 */
export async function trackSnippetCreation(userId: string): Promise<void> {
  await incrementSnippetCount(userId);
}

/**
 * Check if user can export data and return appropriate response
 * @param userId User ID
 * @returns UsageCheckResult with allowed status and optional error response
 */
export async function checkExport(userId: string): Promise<UsageCheckResult> {
  const result = await canExport(userId);

  if (!result.allowed) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: result.reason,
          limit: result.limit,
          currentCount: result.currentCount,
          upgrade: {
            message: 'Upgrade to Pro for unlimited exports',
            tier: 'pro',
          },
        },
        { status: 403 }
      ),
      reason: result.reason,
    };
  }

  return { allowed: true };
}

/**
 * Track export operation (increment counter)
 * @param userId User ID
 */
export async function trackExport(userId: string): Promise<void> {
  await incrementExportCount(userId);
}

/**
 * Check if user can make API calls and return appropriate response
 * @param userId User ID
 * @returns UsageCheckResult with allowed status and optional error response
 */
export async function checkApiCall(userId: string): Promise<UsageCheckResult> {
  const result = await canMakeApiCall(userId);

  if (!result.allowed) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: result.reason || 'API access not available on your plan',
          limit: result.limit,
          currentCount: result.currentCount,
          upgrade: {
            message: 'Upgrade to Pro for API access',
            tier: 'pro',
          },
        },
        { status: 403 }
      ),
      reason: result.reason,
    };
  }

  return { allowed: true };
}

/**
 * Track API call (increment counter)
 * @param userId User ID
 */
export async function trackApiCall(userId: string): Promise<void> {
  await incrementApiCallCount(userId);
}

/**
 * Check if user has access to a specific feature
 * @param userId User ID
 * @param feature Feature name
 * @param featureDisplayName Human-readable feature name for error messages
 * @returns UsageCheckResult with allowed status and optional error response
 */
export async function checkFeatureAccess(
  userId: string,
  feature: Feature,
  featureDisplayName: string
): Promise<UsageCheckResult> {
  const allowed = await hasFeature(userId, feature);

  if (!allowed) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: `${featureDisplayName} is not available on your current plan`,
          feature,
          upgrade: {
            message: `Upgrade to Pro to access ${featureDisplayName}`,
            tier: 'pro',
          },
        },
        { status: 403 }
      ),
      reason: `Feature '${feature}' not available`,
    };
  }

  return { allowed: true };
}

/**
 * Check if user can create private snippets
 * @param userId User ID
 * @returns UsageCheckResult with allowed status and optional error response
 */
export async function checkPrivateSnippets(userId: string): Promise<UsageCheckResult> {
  return checkFeatureAccess(userId, 'private_snippets', 'Private snippets');
}

/**
 * Check if user can use AI explanations
 * @param userId User ID
 * @returns UsageCheckResult with allowed status and optional error response
 */
export async function checkAiExplanations(userId: string): Promise<UsageCheckResult> {
  return checkFeatureAccess(userId, 'ai_explanations', 'AI code explanations');
}

/**
 * Check if user can access analytics
 * @param userId User ID
 * @returns UsageCheckResult with allowed status and optional error response
 */
export async function checkAnalytics(userId: string): Promise<UsageCheckResult> {
  return checkFeatureAccess(userId, 'analytics', 'Analytics dashboard');
}

/**
 * Middleware wrapper for API routes that need snippet creation checks
 * Usage in API route:
 * 
 * ```typescript
 * const user = await requireAuth(request);
 * const usageCheck = await withSnippetCreationLimit(user.userId);
 * if (!usageCheck.allowed) {
 *   return usageCheck.response;
 * }
 * // ... create snippet ...
 * await trackSnippetCreation(user.userId);
 * ```
 */
export async function withSnippetCreationLimit(userId: string): Promise<UsageCheckResult> {
  return checkSnippetCreation(userId);
}

/**
 * Middleware wrapper for API routes that need export checks
 */
export async function withExportLimit(userId: string): Promise<UsageCheckResult> {
  return checkExport(userId);
}

/**
 * Middleware wrapper for API routes that need API call checks
 */
export async function withApiCallLimit(userId: string): Promise<UsageCheckResult> {
  return checkApiCall(userId);
}

/**
 * Helper to extract rate limit info from headers
 * Used to set X-RateLimit-* headers in API responses
 */
export function getRateLimitHeaders(
  limit: number,
  remaining: number,
  reset: Date
): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(Math.floor(reset.getTime() / 1000)),
  };
}

