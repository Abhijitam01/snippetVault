# Premium Features Guide

This document explains what features are currently gated behind paid tiers and how to add new premium features.

## 🎯 Current Premium Features

### Free Tier Limitations
| Feature | Limit | Enforcement Location |
|---------|-------|---------------------|
| **Snippet Count** | 50 max | `app/api/snippets/route.ts` |
| **Private Snippets** | ❌ Not allowed | `app/api/snippets/route.ts` + `app/api/snippets/[id]/route.ts` |
| **Exports** | 1 per month | `app/api/export/route.ts` |
| **API Access** | ❌ Not allowed | N/A (not yet implemented) |
| **Analytics** | ❌ Not allowed | `app/analytics/page.tsx` |
| **AI Code Explanations** | ❌ Not allowed | Not yet implemented |
| **Advanced Search** | ❌ Not allowed | Not yet implemented |
| **Custom Themes** | ❌ Not allowed | Not yet implemented |

### Pro Tier Features ($7/month)
| Feature | Availability | Status |
|---------|-------------|--------|
| **Unlimited Snippets** | ✅ Unlimited | ✅ Implemented |
| **Private Snippets** | ✅ Full access | ✅ Implemented |
| **Unlimited Exports** | ✅ Unlimited | ✅ Implemented |
| **Analytics Dashboard** | ✅ Full access | ✅ Implemented |
| **API Access** | 1,000 calls/month | ⚠️ Structure ready, needs endpoint |
| **AI Code Explanations** | ✅ Full access | ⏳ Not yet implemented |
| **Advanced Search (Regex)** | ✅ Full access | ⏳ Not yet implemented |
| **Custom Themes** | ✅ Full access | ⏳ Not yet implemented |

### Team Tier Features ($15/user/month)
| Feature | Availability | Status |
|---------|-------------|--------|
| All Pro Features | ✅ Included | ✅ Implemented |
| **Team Workspaces** | ✅ Full access | ⏳ Not yet implemented |
| **Shared Collections** | ✅ Full access | ⏳ Not yet implemented |
| **Role-based Permissions** | ✅ Full access | ⏳ Not yet implemented |
| **API Access** | 10,000 calls/month | ⚠️ Structure ready |

### Enterprise Tier Features (Custom pricing)
- Self-hosted option
- Unlimited API calls
- SSO (SAML/OAuth)
- Custom integrations
- Dedicated support
- SLA guarantees

---

## 📝 How Features Are Enforced

### 1. **Feature Gate Check**

File: `lib/features.ts`

```typescript
// Check if user has access to a feature
const hasAnalytics = await hasFeature(userId, 'analytics');

if (!hasAnalytics) {
  return NextResponse.json({ error: 'Upgrade required' }, { status: 403 });
}
```

### 2. **Usage Limit Check**

File: `lib/middleware/usage.ts`

```typescript
// Check snippet creation limit
const usageCheck = await checkSnippetCreation(userId);
if (!usageCheck.allowed) {
  return usageCheck.response; // Returns 403 with upgrade message
}

// Track after creation
await trackSnippetCreation(userId);
```

### 3. **Current Enforcements**

**Snippets API** (`app/api/snippets/route.ts`):
```typescript
// Before creating snippet
const usageCheck = await checkSnippetCreation(currentUser.userId);
if (!usageCheck.allowed) {
  return usageCheck.response!; // Shows: "Reached limit. Upgrade to Pro"
}

// Check private snippet access
if (validatedData.visibility === 'private') {
  const privateCheck = await checkPrivateSnippets(currentUser.userId);
  if (!privateCheck.allowed) {
    return privateCheck.response!; // Shows: "Private snippets only on Pro+"
  }
}

// After successful creation
await trackSnippetCreation(currentUser.userId);
```

**Export API** (`app/api/export/route.ts`):
```typescript
// Check export limit
const exportCheck = await checkExport(currentUser.userId);
if (!exportCheck.allowed) {
  return exportCheck.response!; // Shows: "Export limit reached"
}

// Track after export
await trackExport(currentUser.userId);
```

**Analytics Page** (`app/analytics/page.tsx`):
```typescript
// Checks tier before showing analytics
const accessCheck = await checkAnalytics(user.userId);
if (!accessCheck.allowed) {
  // Shows upgrade banner
  return <UpgradeBanner message="Analytics only on Pro+" />;
}
```

---

## 🚀 How to Add New Premium Features

### Example 1: Add AI Code Explanation (Pro+ Feature)

#### Step 1: Create API Route

Create `app/api/ai/explain/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { checkAiExplanations } from '@/lib/middleware/usage';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    // Check if user has AI access
    const aiCheck = await checkAiExplanations(user.userId);
    if (!aiCheck.allowed) {
      return aiCheck.response!;
    }

    const { code, language } = await request.json();

    // Call OpenAI API (example)
    const explanation = await generateExplanation(code, language);

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('AI explanation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate explanation' },
      { status: 500 }
    );
  }
}

async function generateExplanation(code: string, language: string) {
  // TODO: Implement OpenAI integration
  // const response = await openai.chat.completions.create({
  //   model: "gpt-4",
  //   messages: [{ role: "user", content: `Explain this ${language} code: ${code}` }]
  // });
  return "AI explanation here...";
}
```

#### Step 2: Add UI Button in Snippet Viewer

Update `components/snippets/SnippetViewer.tsx`:

```typescript
import { checkAiExplanations } from '@/lib/middleware/usage';

export default function SnippetViewer({ snippet }) {
  const { user } = useAuth();
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExplainCode = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: snippet.code,
          language: snippet.language,
        }),
      });

      if (res.status === 403) {
        toast.error('AI features only available on Pro plan');
        return;
      }

      const data = await res.json();
      setExplanation(data.explanation);
    } catch (error) {
      toast.error('Failed to generate explanation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ... existing code ... */}
      
      <Button onClick={handleExplainCode} disabled={loading}>
        {loading ? 'Explaining...' : '✨ AI Explain Code (Pro)'}
      </Button>

      {explanation && (
        <div className="mt-4 p-4 bg-blue-500/10 rounded-lg">
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
}
```

---

### Example 2: Add Advanced Search with Regex (Pro+ Feature)

#### Step 1: Update Search API

Update `app/api/search/route.ts`:

```typescript
import { checkFeatureAccess } from '@/lib/middleware/usage';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const useRegex = searchParams.get('regex') === 'true';

  const user = await getUserFromRequest(request);

  // Check if user can use regex search
  if (useRegex && user) {
    const regexCheck = await checkFeatureAccess(
      user.userId,
      'advanced_search',
      'Advanced search with regex'
    );
    if (!regexCheck.allowed) {
      return regexCheck.response!;
    }
  }

  let whereClause;
  if (useRegex && query) {
    // Use raw SQL for regex (PostgreSQL)
    whereClause = {
      OR: [
        { title: { search: query } },
        { code: { search: query } },
      ],
    };
  } else {
    // Standard search
    whereClause = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { code: { contains: query, mode: 'insensitive' } },
      ],
    };
  }

  const snippets = await prisma.snippet.findMany({ where: whereClause });
  return NextResponse.json(snippets);
}
```

#### Step 2: Add Regex Toggle in UI

Update `components/ui/SearchBar.tsx`:

```typescript
export default function SearchBar() {
  const [useRegex, setUseRegex] = useState(false);
  const { user } = useAuth();
  const [userTier, setUserTier] = useState('free');

  useEffect(() => {
    // Fetch user's tier
    if (user) {
      fetch('/api/billing/usage')
        .then(res => res.json())
        .then(data => setUserTier(data.tier));
    }
  }, [user]);

  const handleSearch = (query: string) => {
    const url = `/api/search?query=${encodeURIComponent(query)}&regex=${useRegex}`;
    // ... perform search
  };

  return (
    <div>
      <input type="text" onChange={(e) => handleSearch(e.target.value)} />
      
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={useRegex}
          onChange={(e) => {
            if (userTier === 'free') {
              toast.error('Regex search only on Pro plan');
              return;
            }
            setUseRegex(e.target.checked);
          }}
        />
        <span>Use Regex (Pro)</span>
        {userTier === 'free' && <Lock className="w-3 h-3" />}
      </label>
    </div>
  );
}
```

---

### Example 3: Add Custom Themes (Pro+ Feature)

#### Step 1: Create Theme API

Create `app/api/user/theme/route.ts`:

```typescript
import { requireAuth } from '@/lib/middleware/auth';
import { checkFeatureAccess } from '@/lib/middleware/usage';

export async function PUT(request: NextRequest) {
  const user = await requireAuth(request);

  // Check custom theme access
  const themeCheck = await checkFeatureAccess(
    user.userId,
    'custom_themes',
    'Custom themes'
  );
  if (!themeCheck.allowed) {
    return themeCheck.response!;
  }

  const { theme } = await request.json();

  await prisma.user.update({
    where: { id: user.userId },
    data: { customTheme: theme }, // Add customTheme field to User model
  });

  return NextResponse.json({ success: true });
}
```

#### Step 2: Add Theme Selector in Settings

```typescript
// In settings page
const [selectedTheme, setSelectedTheme] = useState('dark');

const handleThemeChange = async (theme: string) => {
  const res = await fetch('/api/user/theme', {
    method: 'PUT',
    body: JSON.stringify({ theme }),
  });

  if (res.status === 403) {
    toast.error('Custom themes only on Pro plan');
    router.push('/billing');
    return;
  }

  setSelectedTheme(theme);
  toast.success('Theme updated!');
};
```

---

## 📊 Quick Reference: Adding a New Premium Feature

### Checklist:

1. ✅ **Define Feature in Tier Config** (`lib/features.ts`)
   ```typescript
   export const SUBSCRIPTION_TIERS = {
     free: { myFeature: false },
     pro: { myFeature: true },
     // ...
   };
   ```

2. ✅ **Add Feature to Type** (`lib/features.ts`)
   ```typescript
   export type Feature = 
     | 'private_snippets'
     | 'my_new_feature' // Add here
     // ...
   ```

3. ✅ **Create Check Function** (if needed in `lib/middleware/usage.ts`)
   ```typescript
   export async function checkMyFeature(userId: string) {
     return checkFeatureAccess(userId, 'my_new_feature', 'My Feature');
   }
   ```

4. ✅ **Create API Route** (`app/api/my-feature/route.ts`)
   ```typescript
   const check = await checkMyFeature(user.userId);
   if (!check.allowed) return check.response!;
   ```

5. ✅ **Add UI Component**
   - Show "Pro" badge on free tier
   - Disable or show upgrade prompt
   - Add to pricing page features list

6. ✅ **Update Pricing Page** (`app/api/billing/plans/route.ts`)
   ```typescript
   features: [
     // ... existing
     'My awesome feature',
   ]
   ```

7. ✅ **Test Both Tiers**
   - Test as free user (should block)
   - Test as Pro user (should allow)

---

## 🔍 Testing Premium Features

### Test as Free User:
```bash
# Create 50 snippets, then try to create 51st
# Try to create private snippet
# Try to export twice in a month
# Try to access /analytics
```

### Test as Pro User:
```bash
# Use Stripe test card: 4242 4242 4242 4242
# Upgrade to Pro
# Verify all features unlock
# Test unlimited snippets
# Test private snippets
# Access /analytics
```

### Check Current Tier:
```bash
# In browser console:
fetch('/api/billing/usage')
  .then(r => r.json())
  .then(d => console.log('Tier:', d.tier));
```

---

## 💡 Ideas for More Premium Features

1. **Snippet Templates** (Pro) - Pre-made code templates
2. **Code Diff Viewer** (Pro) - Compare snippet versions
3. **Collaboration** (Team) - Real-time editing
4. **Snippet History** (Pro) - Version control for snippets
5. **API Webhooks** (Team) - Get notified on changes
6. **Custom Domains** (Enterprise) - yourdomain.com
7. **White Label** (Enterprise) - Remove branding
8. **Priority Support** (Pro+) - Faster response times
9. **Code Review** (Team) - Review snippets before publishing
10. **Snippet Backup** (Pro) - Auto-backup to cloud storage

---

## 📈 Measuring Success

Track these metrics in `/admin`:
- Free-to-Pro conversion rate (target: 5-10%)
- Feature usage (which premium features are most popular?)
- Churn rate (% of users canceling)
- Time to upgrade (days from signup to paid)

Make features compelling enough that users upgrade naturally!

