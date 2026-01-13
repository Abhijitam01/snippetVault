import { prisma } from '@/lib/prisma';

/**
 * Subscription Tier Configuration
 */
export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    snippetLimit: 50,
    privateSnippets: false,
    apiCallsPerMonth: 0,
    exportsPerMonth: 1,
    aiExplanations: false,
    advancedSearch: false,
    customThemes: false,
    analytics: false,
    priority: 0,
  },
  pro: {
    name: 'Pro',
    priceMonthly: 7,
    priceYearly: 70,
    snippetLimit: -1, // unlimited
    privateSnippets: true,
    apiCallsPerMonth: 1000,
    exportsPerMonth: -1, // unlimited
    aiExplanations: true,
    advancedSearch: true,
    customThemes: true,
    analytics: true,
    priority: 1,
  },
  team: {
    name: 'Team',
    pricePerUser: 15,
    snippetLimit: -1, // unlimited
    privateSnippets: true,
    apiCallsPerMonth: 10000,
    exportsPerMonth: -1, // unlimited
    aiExplanations: true,
    advancedSearch: true,
    customThemes: true,
    analytics: true,
    teamWorkspaces: true,
    sharedCollections: true,
    roleBasedPermissions: true,
    priority: 2,
  },
  enterprise: {
    name: 'Enterprise',
    priceCustom: true,
    snippetLimit: -1, // unlimited
    privateSnippets: true,
    apiCallsPerMonth: -1, // unlimited
    exportsPerMonth: -1, // unlimited
    aiExplanations: true,
    advancedSearch: true,
    customThemes: true,
    analytics: true,
    teamWorkspaces: true,
    sharedCollections: true,
    roleBasedPermissions: true,
    selfHosted: true,
    sso: true,
    dedicatedSupport: true,
    customIntegrations: true,
    priority: 3,
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

/**
 * Feature names that can be gated
 */
export type Feature =
  | 'private_snippets'
  | 'ai_explanations'
  | 'advanced_search'
  | 'custom_themes'
  | 'analytics'
  | 'api_access'
  | 'team_workspaces'
  | 'shared_collections'
  | 'role_based_permissions'
  | 'self_hosted'
  | 'sso'
  | 'dedicated_support'
  | 'custom_integrations';

/**
 * Get user's subscription tier
 */
export async function getUserTier(userId: string): Promise<SubscriptionTier> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { tier: true, status: true, trialEndsAt: true },
  });

  // Check if trial is still active
  if (subscription?.status === 'trialing' && subscription.trialEndsAt) {
    const now = new Date();
    if (subscription.trialEndsAt > now) {
      return subscription.tier as SubscriptionTier;
    }
  }

  // Return tier if subscription is active
  if (subscription?.status === 'active') {
    return subscription.tier as SubscriptionTier;
  }

  // Default to free tier
  return 'free';
}

/**
 * Get subscription tier configuration
 */
export function getTierConfig(tier: SubscriptionTier) {
  return SUBSCRIPTION_TIERS[tier];
}

/**
 * Check if user has access to a specific feature
 */
export async function hasFeature(
  userId: string,
  feature: Feature
): Promise<boolean> {
  const tier = await getUserTier(userId);
  const config = getTierConfig(tier);

  const featureMap: Record<Feature, boolean> = {
    private_snippets: config.privateSnippets || false,
    ai_explanations: config.aiExplanations || false,
    advanced_search: config.advancedSearch || false,
    custom_themes: config.customThemes || false,
    analytics: config.analytics || false,
    api_access: (config.apiCallsPerMonth ?? 0) > 0,
    team_workspaces: ('teamWorkspaces' in config && config.teamWorkspaces) || false,
    shared_collections: ('sharedCollections' in config && config.sharedCollections) || false,
    role_based_permissions: ('roleBasedPermissions' in config && config.roleBasedPermissions) || false,
    self_hosted: ('selfHosted' in config && config.selfHosted) || false,
    sso: ('sso' in config && config.sso) || false,
    dedicated_support: ('dedicatedSupport' in config && config.dedicatedSupport) || false,
    custom_integrations: ('customIntegrations' in config && config.customIntegrations) || false,
  };

  return featureMap[feature] || false;
}

/**
 * Check if user can create a new snippet
 */
export async function canCreateSnippet(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
  currentCount?: number;
  limit?: number;
}> {
  const tier = await getUserTier(userId);
  const config = getTierConfig(tier);

  // Unlimited snippets (-1)
  if (config.snippetLimit === -1) {
    return { allowed: true };
  }

  // Get or create usage tracking
  let usage = await prisma.usageTracking.findUnique({
    where: { userId },
    select: { snippetCount: true },
  });

  if (!usage) {
    // Create usage tracking if it doesn't exist
    usage = await prisma.usageTracking.create({
      data: { userId, snippetCount: 0 },
      select: { snippetCount: true },
    });
  }

  const currentCount = usage.snippetCount;
  const limit = config.snippetLimit;

  if (currentCount >= limit) {
    return {
      allowed: false,
      reason: `You've reached your snippet limit (${limit}). Upgrade to Pro for unlimited snippets.`,
      currentCount,
      limit,
    };
  }

  return { allowed: true, currentCount, limit };
}

/**
 * Check if user can export data
 */
export async function canExport(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
  currentCount?: number;
  limit?: number;
}> {
  const tier = await getUserTier(userId);
  const config = getTierConfig(tier);

  // Unlimited exports (-1)
  if (config.exportsPerMonth === -1) {
    return { allowed: true };
  }

  // Get usage tracking
  const usage = await prisma.usageTracking.findUnique({
    where: { userId },
    select: { exportCount: true, lastExportReset: true },
  });

  if (!usage) {
    return { allowed: true, currentCount: 0, limit: config.exportsPerMonth };
  }

  // Check if we need to reset the counter (monthly)
  const now = new Date();
  const lastReset = usage.lastExportReset;
  const monthsSinceReset =
    (now.getFullYear() - lastReset.getFullYear()) * 12 +
    now.getMonth() -
    lastReset.getMonth();

  if (monthsSinceReset >= 1) {
    // Reset the counter
    await prisma.usageTracking.update({
      where: { userId },
      data: { exportCount: 0, lastExportReset: now },
    });
    return { allowed: true, currentCount: 0, limit: config.exportsPerMonth };
  }

  const currentCount = usage.exportCount;
  const limit = config.exportsPerMonth;

  if (currentCount >= limit) {
    return {
      allowed: false,
      reason: `You've reached your monthly export limit (${limit}). Upgrade to Pro for unlimited exports.`,
      currentCount,
      limit,
    };
  }

  return { allowed: true, currentCount, limit };
}

/**
 * Check if user can make API calls
 */
export async function canMakeApiCall(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
  currentCount?: number;
  limit?: number;
}> {
  const tier = await getUserTier(userId);
  const config = getTierConfig(tier);

  // No API access on free tier
  if (config.apiCallsPerMonth === 0) {
    return {
      allowed: false,
      reason: 'API access is only available on Pro tier and above.',
    };
  }

  // Unlimited API calls (-1)
  if (config.apiCallsPerMonth === -1) {
    return { allowed: true };
  }

  // Get usage tracking
  const usage = await prisma.usageTracking.findUnique({
    where: { userId },
    select: { apiCallsCount: true, lastApiReset: true },
  });

  if (!usage) {
    return { allowed: true, currentCount: 0, limit: config.apiCallsPerMonth };
  }

  // Check if we need to reset the counter (monthly)
  const now = new Date();
  const lastReset = usage.lastApiReset;
  const monthsSinceReset =
    (now.getFullYear() - lastReset.getFullYear()) * 12 +
    now.getMonth() -
    lastReset.getMonth();

  if (monthsSinceReset >= 1) {
    // Reset the counter
    await prisma.usageTracking.update({
      where: { userId },
      data: { apiCallsCount: 0, lastApiReset: now },
    });
    return { allowed: true, currentCount: 0, limit: config.apiCallsPerMonth };
  }

  const currentCount = usage.apiCallsCount;
  const limit = config.apiCallsPerMonth;

  if (currentCount >= limit) {
    return {
      allowed: false,
      reason: `You've reached your monthly API call limit (${limit}). Upgrade for more API calls.`,
      currentCount,
      limit,
    };
  }

  return { allowed: true, currentCount, limit };
}

/**
 * Increment snippet count for a user
 */
export async function incrementSnippetCount(userId: string): Promise<void> {
  await prisma.usageTracking.upsert({
    where: { userId },
    update: { snippetCount: { increment: 1 } },
    create: { userId, snippetCount: 1 },
  });
}

/**
 * Decrement snippet count for a user
 */
export async function decrementSnippetCount(userId: string): Promise<void> {
  const usage = await prisma.usageTracking.findUnique({
    where: { userId },
    select: { snippetCount: true },
  });

  if (usage && usage.snippetCount > 0) {
    await prisma.usageTracking.update({
      where: { userId },
      data: { snippetCount: { decrement: 1 } },
    });
  }
}

/**
 * Increment export count for a user
 */
export async function incrementExportCount(userId: string): Promise<void> {
  await prisma.usageTracking.upsert({
    where: { userId },
    update: { exportCount: { increment: 1 } },
    create: { userId, exportCount: 1 },
  });
}

/**
 * Increment API call count for a user
 */
export async function incrementApiCallCount(userId: string): Promise<void> {
  await prisma.usageTracking.upsert({
    where: { userId },
    update: { apiCallsCount: { increment: 1 } },
    create: { userId, apiCallsCount: 1 },
  });
}

/**
 * Get user's usage statistics
 */
export async function getUsageStats(userId: string): Promise<{
  tier: SubscriptionTier;
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
}> {
  const tier = await getUserTier(userId);
  const config = getTierConfig(tier);

  const usage = await prisma.usageTracking.findUnique({
    where: { userId },
    select: {
      snippetCount: true,
      apiCallsCount: true,
      exportCount: true,
    },
  });

  const snippetCount = usage?.snippetCount || 0;
  const apiCallsCount = usage?.apiCallsCount || 0;
  const exportCount = usage?.exportCount || 0;

  const snippetLimit = config.snippetLimit === -1 ? Infinity : config.snippetLimit;
  const apiCallsLimit = config.apiCallsPerMonth === -1 ? Infinity : (config.apiCallsPerMonth || 0);
  const exportLimit = config.exportsPerMonth === -1 ? Infinity : config.exportsPerMonth;

  return {
    tier,
    snippetCount,
    snippetLimit,
    apiCallsCount,
    apiCallsLimit,
    exportCount,
    exportLimit,
    percentages: {
      snippets: snippetLimit === Infinity ? 0 : (snippetCount / snippetLimit) * 100,
      apiCalls: apiCallsLimit === Infinity ? 0 : (apiCallsCount / apiCallsLimit) * 100,
      exports: exportLimit === Infinity ? 0 : (exportCount / exportLimit) * 100,
    },
  };
}

/**
 * Initialize subscription and usage tracking for a new user
 */
export async function initializeUserSubscription(userId: string): Promise<void> {
  // Create free tier subscription
  await prisma.subscription.create({
    data: {
      userId,
      tier: 'free',
      status: 'active',
    },
  });

  // Create usage tracking
  await prisma.usageTracking.create({
    data: {
      userId,
      snippetCount: 0,
      apiCallsCount: 0,
      exportCount: 0,
    },
  });
}

