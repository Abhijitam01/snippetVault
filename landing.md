# Landing Page Code Recreation

This document contains all the code necessary to recreate the Solana Playground landing page. The files are organized by their path in the project structure.

## Configuration & Global Styles

### `apps/web/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
          light: "hsl(var(--primary-light))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          light: "hsl(var(--destructive-light))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          light: "hsl(var(--success-light))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          light: "hsl(var(--warning-light))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
          light: "hsl(var(--info-light))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
      },
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        "2xl": "var(--spacing-2xl)",
      },
      animation: {
        "fade-in": "fadeIn var(--duration-normal) ease-in-out",
        "slide-up": "slideUp var(--duration-normal) ease-out",
        "slide-down": "slideDown var(--duration-normal) ease-out",
        "scale-in": "scaleIn var(--duration-fast) ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
```

### `apps/web/app/globals.css`

```css
@import url("https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap");

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-sans:
      "Satoshi", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    --font-mono:
      ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas,
      "Liberation Mono", "Courier New", monospace;
    /* Base colors */
    --background: 36 33% 96%;
    --foreground: 215 32% 12%;
    --card: 0 0% 100%;
    --card-foreground: 215 32% 12%;
    --popover: 0 0% 100%;
    --popover-foreground: 215 32% 12%;

    /* Primary colors */
    --primary: 176 70% 38%;
    --primary-foreground: 0 0% 98%;
    --primary-hover: 176 70% 32%;
    --primary-light: 176 70% 92%;

    /* Secondary colors */
    --secondary: 210 20% 92%;
    --secondary-foreground: 215 32% 12%;

    /* Muted colors */
    --muted: 210 20% 94%;
    --muted-foreground: 215 15% 45%;

    /* Accent colors */
    --accent: 28 96% 85%;
    --accent-foreground: 24 60% 20%;

    /* Semantic colors */
    --success: 145 60% 38%;
    --success-foreground: 0 0% 98%;
    --success-light: 145 60% 92%;
    --warning: 32 92% 52%;
    --warning-foreground: 24 50% 15%;
    --warning-light: 32 92% 92%;
    --info: 205 80% 45%;
    --info-foreground: 0 0% 98%;
    --info-light: 205 80% 92%;
    --destructive: 0 75% 52%;
    --destructive-foreground: 0 0% 100%;
    --destructive-light: 0 75% 94%;

    /* Border and input */
    --border: 210 20% 88%;
    --input: 210 20% 88%;
    --ring: 176 70% 38%;

    /* Radius */
    --radius: 0.75rem;

    /* Spacing scale */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md:
      0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg:
      0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-xl:
      0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

    /* Animation durations */
    --duration-fast: 150ms;
    --duration-normal: 200ms;
    --duration-slow: 300ms;
  }

  .dark {
    /* Base colors */
    --background: 210 32% 8%;
    --foreground: 210 20% 96%;
    --card: 210 30% 10%;
    --card-foreground: 210 20% 96%;
    --popover: 210 30% 10%;
    --popover-foreground: 210 20% 96%;

    /* Primary colors */
    --primary: 176 70% 48%;
    --primary-foreground: 210 32% 8%;
    --primary-hover: 176 70% 56%;
    --primary-light: 176 70% 20%;

    /* Secondary colors */
    --secondary: 210 28% 16%;
    --secondary-foreground: 210 20% 96%;

    /* Muted colors */
    --muted: 210 28% 16%;
    --muted-foreground: 210 16% 60%;

    /* Accent colors */
    --accent: 28 60% 24%;
    --accent-foreground: 28 75% 85%;

    /* Semantic colors */
    --success: 145 60% 45%;
    --success-foreground: 210 32% 8%;
    --success-light: 145 60% 22%;
    --warning: 32 92% 58%;
    --warning-foreground: 210 32% 8%;
    --warning-light: 32 92% 24%;
    --info: 205 80% 60%;
    --info-foreground: 210 32% 8%;
    --info-light: 205 80% 24%;
    --destructive: 0 70% 55%;
    --destructive-foreground: 210 20% 96%;
    --destructive-light: 0 70% 24%;

    /* Border and input */
    --border: 210 28% 16%;
    --input: 210 28% 16%;
    --ring: 176 70% 48%;

    /* Shadows for dark mode */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
    --shadow-md:
      0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3);
    --shadow-lg:
      0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3);
    --shadow-xl:
      0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.3);
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings:
      "rlig" 1,
      "calt" 1;
    font-family: var(--font-sans), "Helvetica Neue", sans-serif;
    letter-spacing: 0.01em;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    /* Global grid pattern - cool lines effect */
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 64px 64px;
    background-position: 0 0;
  }

  /* Dark mode grid pattern */
  .dark body,
  body.dark {
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  }

  /* Code font */
  code,
  pre,
  .font-mono {
    font-family: var(--font-mono), "Courier New", monospace;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    @apply bg-muted;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-muted-foreground/30 rounded-full;
  }

  ::-webkit-scrollbar-thumb:hover {
    @apply bg-muted-foreground/50;
  }
}

@layer utilities {
  /* Glassmorphism effect */
  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .dark .glass {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* Gradient text */
  .gradient-text {
    @apply bg-gradient-to-r from-primary via-emerald-500 to-amber-500 bg-clip-text text-transparent;
  }

  /* Grid pattern background - cool lines effect */
  .grid-pattern {
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 64px 64px;
    background-position: 0 0;
  }

  /* Grid pattern for dark backgrounds */
  .grid-pattern-dark {
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 64px 64px;
    background-position: 0 0;
  }

  /* Grid pattern for light backgrounds */
  .grid-pattern-light {
    background-image:
      linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
    background-size: 64px 64px;
    background-position: 0 0;
  }

  /* Button styles */
  .btn-primary {
    @apply inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-all duration-fast;
    box-shadow: 0 10px 20px -12px hsl(var(--primary) / 0.6);
  }

  .btn-primary:hover {
    @apply bg-[#14F195];
    transform: translateY(-1px);
  }

  .btn-ghost {
    @apply inline-flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-fast hover:text-foreground;
  }

  .btn-ghost:hover {
    @apply bg-[#14F195]/20 text-[#14F195];
  }

  /* Focus visible */
  .focus-ring {
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
  }

  /* Loading dots */
  .loading-dot {
    display: inline-block;
    width: 0.5em;
    height: 0.5em;
    border-radius: 50%;
    background-color: currentColor;
    animation: loading-dot-bounce 1.4s ease-in-out infinite;
    will-change: transform, opacity;
  }

  @keyframes loading-dot-bounce {
    0%,
    80%,
    100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
}
```

### `apps/web/lib/seo.ts`

```typescript
import { Metadata } from "next";

function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Default fallback
  return "https://solana-atlas.com";
}

const siteUrl = getSiteUrl();

export function getBaseUrl(): string {
  return siteUrl;
}

export interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

export function generateMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    path = "",
    image = "/logo/og.png",
    noIndex = false,
    keywords = [],
    type = "website",
    publishedTime,
    modifiedTime,
    authors = [],
  } = options;

  const url = `${siteUrl}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      type: type === "article" ? "article" : "website",
      url,
      title,
      description,
      siteName: "Solana Atlas",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: authors.length > 0 ? authors : undefined,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };

  return metadata;
}
```

### `apps/web/lib/supabase.ts`

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

### `apps/web/components/ui/LoadingSpinner.tsx`

```typescript
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({
  size = "md",
  className = "",
  text = "Loading",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium text-foreground/70 ${sizeClasses[size]} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <span className="loading-dot" style={{ animationDelay: "0s" }} />
      <span className="loading-dot" style={{ animationDelay: "0.2s" }} />
      <span className="loading-dot" style={{ animationDelay: "0.4s" }} />
    </span>
  );
}
```

### `apps/web/components/Logo.tsx`

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  height?: number;
  showWordmark?: boolean;
  className?: string;
}

export function Logo({
  height = 72,
  showWordmark = true,
  className = ""
}: LogoProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <Link href="/" className={`flex items-center gap-2 ${className}`}>
        <div
          className="relative flex items-center justify-center bg-[#14F195] rounded"
          style={{ width: height, height: height }}
        >
          <span className="text-black font-bold text-xs">SA</span>
        </div>
        {showWordmark && (
          <span className="font-semibold tracking-[0.18em] text-base md:text-lg uppercase text-[#FAFAFA]">
            Solana Atlas
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div
        className="relative flex items-center justify-center"
        style={{ width: height, height: height }}
      >
        <Image
          src="/logo/og.png"
          alt="Solana Atlas"
          width={height}
          height={height}
          className="w-full h-full object-contain"
          priority
          unoptimized
          onError={() => setImageError(true)}
        />
      </div>
      {showWordmark && (
        <span className="font-semibold tracking-[0.18em] text-sm md:text-base uppercase text-[#FAFAFA]">
          Solana Atlas
        </span>
      )}
    </Link>
  );
}
```
## Providers & Core Components

### `apps/web/components/providers/AuthProvider.tsx`

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createSupabaseClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        router.refresh();
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### `apps/web/components/auth/AuthButton.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { User as UserIcon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function AuthButton() {
  const { user, loading, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (loading) {
    return (
      <div className="w-10 h-10 flex items-center justify-center">
        <LoadingSpinner size="sm" className="text-white/50" text="Loading" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-[#14F195] to-[#00D18C] p-[1px]"
        >
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
            {user.user_metadata.avatar_url ? (
              <Image
                src={user.user_metadata.avatar_url}
                alt="User"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-5 h-5 text-[#14F195]" />
            )}
          </div>
        </button>

        <AnimatePresence>
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#0a0a0a] border border-white/10 shadow-xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-white/10">
                  <p className="text-sm font-medium truncate">
                    {user.user_metadata.full_name || user.email}
                  </p>
                  <p className="text-xs text-white/40 truncate">{user.email}</p>
                </div>

                <div className="p-1">
                  <Link
                    href="/my-code"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <UserIcon className="w-4 h-4" />
                    My Code
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-nowrap whitespace-nowrap">
      <Link
        href="/login"
        className="text-sm sm:text-base font-medium text-white/60 hover:text-white transition-colors flex-shrink-0"
      >
        Sign In
      </Link>
      <Link
        href="/signup"
        className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm sm:text-base font-medium flex-shrink-0"
      >
        Sign Up
      </Link>
    </div>
  );
}
```

### `apps/web/lib/trpc-client.ts`

```typescript
import { createTRPCReact } from "@trpc/react-query";
// NOTE: AppRouter is a server-side type. For pure frontend recreation, you can use 'any'
// import type { AppRouter } from '@/server/routers/_app';
type AppRouter = any;
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpcClientOptions = {
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
    }),
  ],
};
```

### `apps/web/stores/settings.ts`

```typescript
import { createWithEqualityFn } from "zustand/traditional";
import { persist } from "zustand/middleware";

type ThemeMode = "dark" | "light";
type PlaygroundTheme = "default" | "grid" | "matrix";

interface SettingsState {
  explanationsEnabled: boolean;
  theme: ThemeMode;
  playgroundTheme: PlaygroundTheme;
  toggleExplanations: () => void;
  setExplanationsEnabled: (enabled: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setPlaygroundTheme: (theme: PlaygroundTheme) => void;
}

export const useSettingsStore = createWithEqualityFn<SettingsState>()(
  persist(
    (set) => ({
      explanationsEnabled: true,
      theme: "dark",
      // Use the grid playground theme by default; others remain available as options
      playgroundTheme: "grid",
      toggleExplanations: () =>
        set((state) => ({ explanationsEnabled: !state.explanationsEnabled })),
      setExplanationsEnabled: (enabled) =>
        set({ explanationsEnabled: enabled }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
      setTheme: (theme) => set({ theme }),
      setPlaygroundTheme: (theme) => set({ playgroundTheme: theme }),
    }),
    {
      name: "solana-playground-settings",
      partialize: (state) => ({
        explanationsEnabled: state.explanationsEnabled,
        theme: state.theme,
        playgroundTheme: state.playgroundTheme,
      }),
    },
  ),
);
```

### `apps/web/components/ErrorBoundary.tsx`

```typescript
"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mb-6">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### `apps/web/components/seo/StructuredData.tsx`

```typescript
"use client";

import { useEffect } from "react";
import { getBaseUrl } from "@/lib/seo";

const siteUrl = getBaseUrl();

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Solana Atlas",
  description:
    "Interactive Solana programming playground for learning blockchain development",
  url: siteUrl,
  logo: `${siteUrl}/logo/og.png`,
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Technical Support",
    availableLanguage: "English",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Solana Atlas",
  url: siteUrl,
  description: "Learn Solana programming through interactive, explorable code",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/playground?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Solana Atlas",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    ratingCount: "1",
  },
};

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Solana Programming Course",
  description: "Interactive course for learning Solana blockchain development",
  provider: {
    "@type": "Organization",
    name: "Solana Atlas",
    sameAs: siteUrl,
  },
  courseCode: "SOLANA-101",
  educationalLevel: "Beginner to Advanced",
  inLanguage: "en-US",
};

export function StructuredData() {
  useEffect(() => {
    const schemas = [
      organizationSchema,
      websiteSchema,
      softwareApplicationSchema,
      courseSchema,
    ];

    // Remove existing structured data scripts to avoid duplicates
    const existingScripts = document.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    existingScripts.forEach((script) => {
      if (script.id?.startsWith("structured-data-")) {
        script.remove();
      }
    });

    // Add structured data scripts to head
    schemas.forEach((schema, index) => {
      const script = document.createElement("script");
      script.id = `structured-data-${index}`;
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      // Cleanup on unmount
      const scripts = document.querySelectorAll(
        'script[id^="structured-data-"]',
      );
      scripts.forEach((script) => script.remove());
    };
  }, []);

  return null;
}
```
## Landing Page Sections

### `apps/web/components/landing/Hero.tsx`

```typescript
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Lock, BookOpen, Rocket } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export function Hero() {
  return (
    <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-32 px-4 sm:px-6 flex items-center justify-center bg-[#0A0A0A] text-[#FAFAFA] border-b border-[#262626] min-h-[70vh] sm:min-h-[80vh] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]">
      <div className="max-w-[1200px] w-full text-center relative z-10 px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-6 flex justify-center">
            <span className="px-3 py-1 text-xs font-mono text-[#14F195] border border-[#14F195]/20 bg-[#14F195]/5 rounded uppercase tracking-wider">
              v1.0 Public Beta
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-[36px] leading-[1.1] sm:text-[48px] md:text-[64px] lg:text-[80px] xl:text-[96px] font-bold tracking-tight mb-6 sm:mb-8 text-white px-2"
          >
            The Solana Playground
            <br />
            <span className="text-[#14F195]">you needed.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-[16px] leading-[24px] sm:text-[18px] sm:leading-[28px] md:text-[20px] md:leading-[32px] lg:text-[22px] text-[#A3A3A3] mb-8 sm:mb-12 max-w-[600px] mx-auto px-4"
          >
            Run real Solana programs. Watch state transform.
            Understand execution—not just syntax.
            Zero setup. No wallet. Open source.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-8 sm:mb-12 px-4"
          >
            <Link
              href="/playground/hello-solana"
              className="w-full sm:w-auto bg-[#FAFAFA] text-[#0A0A0A] px-8 sm:px-10 py-3 sm:py-4 rounded text-sm sm:text-base font-semibold hover:bg-white transition-colors text-center"
            >
              Open Playground
            </Link>
            <a
              href="#examples"
              className="w-full sm:w-auto bg-transparent text-[#A3A3A3] border border-[#262626] px-8 sm:px-10 py-3 sm:py-4 rounded text-sm sm:text-base font-medium hover:text-[#FAFAFA] hover:border-[#525252] transition-colors text-center"
            >
              Browse Examples
            </a>
          </motion.div>

          {/* Fast Facts - Grid Style */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#262626] border border-[#262626] rounded-lg overflow-hidden max-w-3xl mx-auto w-full"
          >
            {[
              { icon: Zap, text: "Zero setup" },
              { icon: Lock, text: "Sandboxed" },
              { icon: BookOpen, text: "Open source" },
              { icon: Rocket, text: "Active dev" },
            ].map((fact, i) => (
              <div key={i} className="flex items-center justify-center gap-2 sm:gap-3 py-4 sm:py-5 md:py-6 bg-[#0A0A0A] text-xs sm:text-sm md:text-base text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#111111] transition-all px-3 sm:px-4">
                <fact.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
                <span className="font-medium">{fact.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
```

### `apps/web/components/landing/ProductDemo.tsx`

```typescript
"use client";

import { motion } from "framer-motion";

export function ProductDemo() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0A0A0A] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-center mb-8 sm:mb-12">
           <span className="px-3 py-1 rounded-full border border-[#262626] bg-[#111111] text-[10px] sm:text-xs font-mono text-[#737373] uppercase tracking-wider">
            Interactive Environment
           </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-lg border border-[#262626] bg-[#0A0A0A] shadow-2xl overflow-hidden"
        >
          {/* Editor Header */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-[#262626] bg-[#111111]">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#262626]" />
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#262626]" />
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#262626]" />
            </div>
            <div className="flex items-center gap-1 text-[8px] sm:text-[10px] font-mono text-[#525252] uppercase tracking-wide">
              <span className="hidden sm:inline">lib.rs</span>
              <span className="hidden sm:inline text-[#262626]">/</span>
              <span className="hidden sm:inline">state.rs</span>
              <span className="hidden sm:inline text-[#262626]">/</span>
              <span className="text-[#FAFAFA]">main</span>
            </div>
            <div className="w-8 sm:w-16" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] sm:min-h-[500px] divide-y lg:divide-y-0 lg:divide-x divide-[#262626]">
            {/* Left: Code Editor */}
            <div className="p-4 sm:p-6 font-mono text-[10px] sm:text-xs md:text-sm leading-relaxed bg-[#0A0A0A] overflow-x-auto">
              <div className="text-[#525252] mb-4">Solana Program Logic</div>
              <div className="space-y-1 text-[#D4D4D4]">
                <div><span className="text-[#C586C0]">use</span> anchor_lang::prelude::*;</div>
                <br />
                <div>#[program]</div>
                <div><span className="text-[#C586C0]">pub mod</span> vault &#123;</div>
                <div className="pl-4"><span className="text-[#C586C0]">pub fn</span> <span className="text-[#DCDCAA]">initialize</span>(ctx: Context&lt;Initialize&gt;) -&gt; Result&lt;()&gt; &#123;</div>
                <div className="pl-8"><span className="text-[#569CD6]">let</span> vault = &amp;<span className="text-[#C586C0]">mut</span> ctx.accounts.vault;</div>
                <div className="pl-8">vault.authority = ctx.accounts.authority.key();</div>
                <div className="pl-8">vault.balance = <span className="text-[#B5CEA8]">0</span>;</div>
                <br />
                <div className="pl-8"><span className="text-[#4EC9B0]">msg!</span>(&quot;Vault initialized&quot;);</div>
                <div className="pl-8"><span className="text-[#C586C0]">Ok</span>(())</div>
                <div className="pl-4">&#125;</div>
                <div>&#125;</div>
                <br />
                <div>#[derive(Accounts)]</div>
                <div><span className="text-[#C586C0]">pub struct</span> Initialize&lt;&apos;info&gt; &#123;</div>
                <div className="pl-4">#[account(init, payer = authority, space = 8 + 32 + 8)]</div>
                <div className="pl-4"><span className="text-[#C586C0]">pub</span> vault: Account&lt;&apos;info, Vault&gt;,</div>
                <div className="pl-4">...</div>
                <div>&#125;</div>
              </div>
            </div>

            {/* Right: State & Logs */}
            <div className="flex flex-col h-full bg-[#0A0A0A] divide-y divide-[#262626]">
              {/* State Panel */}
              <div className="flex-1 p-4 sm:p-6 bg-[#0B0B0B]">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-[9px] sm:text-[10px] font-bold text-[#525252] uppercase tracking-wider">Account State</span>
                  <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/20 font-mono">Running</span>
                </div>
                <div className="font-mono text-[10px] sm:text-xs md:text-sm space-y-2 sm:space-y-3">
                  <div className="p-2 sm:p-3 bg-[#111111] border border-[#262626] rounded">
                    <div className="text-[#A3A3A3] text-[10px] sm:text-xs mb-1">Address</div>
                    <div className="text-[#FAFAFA] text-[10px] sm:text-xs break-all">vault_account</div>
                  </div>
                  <div className="p-2 sm:p-3 bg-[#111111] border border-[#262626] rounded">
                     <div className="flex justify-between text-[10px] sm:text-xs">
                        <span className="text-[#A3A3A3]">authority</span>
                        <span className="text-[#14F195] break-all">Fg6P...n4Zq</span>
                     </div>
                     <div className="flex justify-between mt-2 text-[10px] sm:text-xs">
                        <span className="text-[#A3A3A3]">balance</span>
                        <span className="text-[#FAFAFA]">0 SOL</span>
                     </div>
                  </div>
                </div>
              </div>

              {/* Execution Log */}
              <div className="flex-1 p-4 sm:p-6 bg-[#0A0A0A]">
                <div className="text-[9px] sm:text-[10px] font-bold text-[#525252] uppercase tracking-wider mb-3 sm:mb-4">Terminal Output</div>
                <div className="font-mono text-[10px] sm:text-xs space-y-1.5 sm:space-y-2">
                  <div className="flex gap-3 text-[#525252]">
                    <span className="select-none text-[#333]">$</span>
                    <span>solana program deploy target/deploy/vault.so</span>
                  </div>
                  <div className="flex gap-3 text-[#A3A3A3]">
                    <span className="opacity-50">14:20:01</span>
                    <span>→ Program invoked</span>
                  </div>
                  <div className="flex gap-3 text-[#A3A3A3]">
                    <span className="opacity-50">14:20:01</span>
                    <span>→ Account created (vault)</span>
                  </div>
                  <div className="flex gap-3 text-[#14F195]">
                    <span className="opacity-50">14:20:02</span>
                    <span>✓ Vault initialized</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

### `apps/web/components/landing/WhySwitch.tsx`

```typescript
"use client";

import { Check, Eye, Microscope, X } from "lucide-react";

const features = [
  {
    icon: Check,
    title: "Code with context",
    before: "Code without context",
    after: "Every line explained",
    description: "Inline explanations for instructions, accounts, and Anchor macros.",
    gradient: "from-blue-500/10 to-blue-500/5"
  },
  {
    icon: Eye,
    title: "Visual State",
    before: "Hidden state changes",
    after: "Watch accounts transform",
    description: "Real-time visualization of account data, PDAs, and lamport transfers.",
    gradient: "from-purple-500/10 to-purple-500/5"
  },
  {
    icon: Microscope,
    title: "Deep Understanding",
    before: "Trial and error",
    after: "Understand on first read",
    description: "Execution logs map to your code line-by-line. No guessing.",
    gradient: "from-green-500/10 to-green-500/5"
  }
];

export function WhySwitch() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0A0A0A] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4 sm:gap-6 border-b border-[#262626] pb-6 sm:pb-8">
          <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-[#FAFAFA] leading-tight max-w-md">
            Why developers are switching
          </h2>
          <p className="text-[#737373] text-xs sm:text-sm max-w-sm">
            Move beyond simple text editors. Experience a true Solana development environment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-[#262626] border border-[#262626] rounded-lg overflow-hidden">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-[#0A0A0A] p-8 hover:bg-[#111111] transition-colors group relative"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.gradient} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className="relative z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#1A1A1A] border border-[#262626] flex items-center justify-center mb-4 sm:mb-6 text-[#FAFAFA]">
                  <feature.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-[#FAFAFA] mb-3 sm:mb-4">{feature.title}</h3>

                <div className="space-y-2 mb-4 sm:mb-6 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-[#525252] line-through">
                    <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" /> <span>{feature.before}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#14F195] font-medium">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" /> <span>{feature.after}</span>
                  </div>
                </div>

                <p className="text-[#737373] text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```
### `apps/web/components/landing/HowItWorks.tsx`

```typescript
"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "STEP 01",
    title: "Open an example",
    subtitle: "Start with PDAs, tokens, or account management"
  },
  {
    number: "STEP 02",
    title: "Read code with context",
    subtitle: "Hover over instructions for inline explanations"
  },
  {
    number: "STEP 03",
    title: "Run and inspect state",
    subtitle: "See accounts, balances, and logs in real-time"
  },
  {
    number: "STEP 04",
    title: "Modify and rerun",
    subtitle: "Experiment safely in a sandboxed environment"
  }
] as const;

export function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    const sections = sectionRefs.current.filter(
      (el): el is HTMLDivElement => el !== null
    );

    if (!sections.length) return;

    // Function to find the section closest to the center of the viewport
    const findActiveSection = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestSection = activeIndexRef.current;
      let minDistance = Infinity;

      sections.forEach((section, index) => {
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - sectionCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestSection = index;
        }
      });

      if (closestSection !== activeIndexRef.current) {
        activeIndexRef.current = closestSection;
        setActiveIndex(closestSection);
      }
    };

    // Track intersection ratios for all sections
    const intersectionRatios = new Map<number, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const indexAttr = entry.target.getAttribute("data-section-index");
          if (indexAttr) {
            const index = Number(indexAttr);
            if (!Number.isNaN(index)) {
              intersectionRatios.set(index, entry.intersectionRatio);
            }
          }
        });

        // Find the section with the highest intersection ratio
        let maxRatio = 0;
        let activeSectionIndex = activeIndexRef.current;

        intersectionRatios.forEach((ratio, index) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            activeSectionIndex = index;
          }
        });

        // Update active index if we have a visible section
        if (maxRatio > 0.1 && activeSectionIndex !== activeIndexRef.current) {
          activeIndexRef.current = activeSectionIndex;
          setActiveIndex(activeSectionIndex);
        }
      },
      {
        root: null,
        rootMargin: "-10% 0px -10% 0px",
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
      }
    );

    sections.forEach((section) => observer.observe(section));

    // Also use scroll event as a fallback for more reliable tracking
    const handleScroll = () => {
      findActiveSection();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    findActiveSection();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section id="how-it-works" className="bg-[#0a0a0a] text-white py-16 sm:py-24 md:py-28 px-4 sm:px-6 md:px-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]">
      <div className="max-w-[1600px] mx-auto pl-0 md:pl-[200px]">
        <div className="flex flex-col lg:grid gap-6 sm:gap-10 lg:grid-cols-[400px,1fr] lg:gap-24 relative">
          {/* Left: Steps sidebar with heading */}
          <div className="lg:sticky lg:top-28 h-fit order-2 lg:order-1">
            <div className="relative lg:pl-10">
              {/* How it works heading */}
              <div className="pb-4 sm:pb-6 pt-2 sm:pt-4 mb-6 sm:mb-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.02em]">
                  How it works
                </h2>
              </div>

              {/* Vertical line (desktop) */}
              <div className="hidden lg:block absolute left-[18px] top-[140px] bottom-8 w-px bg-white/10" />

              <div className="flex lg:block gap-3 sm:gap-4 overflow-x-auto pb-4 lg:pb-0 lg:overflow-visible scrollbar-hide md:overflow-x-visible">
                {steps.map((step, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={step.number}
                      type="button"
                      className={[
                        "group relative flex-shrink-0 lg:flex-shrink text-left transition-all duration-300",
                        "lg:py-6 lg:pl-6 lg:pr-2",
                        "lg:block rounded-lg lg:rounded-none border border-transparent",
                        isActive
                          ? "bg-[rgba(0,255,163,0.05)] border-[rgba(0,255,163,0.2)]"
                          : "bg-[rgba(255,255,255,0.02)] lg:bg-transparent"
                      ].join(" ")}
                      onClick={() => {
                        const target = sectionRefs.current[index];
                        if (target) {
                          target.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                          });
                        }
                      }}
                    >
                      {/* Bullet (desktop) */}
                      <div className="hidden lg:block absolute left-[-5px] top-7">
                        <div
                          className={[
                            "rounded-full transition-all duration-300",
                            isActive
                              ? "w-3 h-3 bg-[#00ffa3] shadow-[0_0_12px_rgba(0,255,163,0.5)]"
                              : "w-2 h-2 bg-white/20"
                          ].join(" ")}
                        />
                      </div>

                      <div className="px-3 py-2.5 sm:px-4 sm:py-3 lg:px-0 lg:py-0">
                        <div
                          className={[
                            "text-[10px] sm:text-xs font-semibold tracking-[0.2em] mb-1 transition-colors",
                            isActive ? "text-[#00ffa3]" : "text-[#666666]"
                          ].join(" ")}
                        >
                          {step.number}
                        </div>
                        <div
                          className={[
                            "text-sm sm:text-base md:text-lg font-semibold transition-colors",
                            isActive ? "text-white" : "text-[#999999]"
                          ].join(" ")}
                        >
                          {step.title}
                        </div>
                        <p className="mt-1 text-[10px] sm:text-xs md:text-sm text-[#737373] hidden lg:block">
                          {step.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Scroll sections */}
          <div className="flex flex-col order-1 lg:order-2">
            {/* Section 1 */}
            <div
              ref={(el) => {
                sectionRefs.current[0] = el;
              }}
              data-section-index={0}
              className="min-h-[60vh] sm:min-h-[70vh] flex items-center py-6 sm:py-10 md:py-16"
            >
              <div
                className={[
                  "w-full transition-all duration-200 ease-out",
                  activeIndex === 0
                    ? "opacity-100 translate-y-0"
                    : "opacity-20 translate-y-10"
                ].join(" ")}
              >
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 sm:mb-3 tracking-[-0.01em]">
                    Open an example
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-[#999999]">
                    Start with PDAs, tokens, or account management
                  </p>
                </div>

                <div className="flex flex-col gap-6 sm:gap-8">
                  <div className="flex flex-col gap-3 sm:gap-5">
                    {[
                      "Choose from 20+ curated examples covering common Solana patterns",
                      "Examples include token creation, NFTs, staking, and DeFi protocols",
                      "Every example comes with complete working code and documentation"
                    ].map((text) => (
                      <div
                        key={text}
                        className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-white/5/10 border-l-2 border-l-transparent rounded-lg transition-all duration-300 hover:bg-white/[0.04] hover:border-l-[#00ffa3] hover:translate-x-1"
                      >
                        <div className="mt-0.5 sm:mt-1 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="w-4 h-4 sm:w-5 sm:h-5 stroke-[#00ffa3] stroke-2"
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <p className="text-xs sm:text-sm md:text-[15px] text-[#cccccc] leading-relaxed">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 sm:p-6 md:p-8 mt-1 max-w-[580px] overflow-x-auto">
                    <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#666666] font-semibold mb-3 sm:mb-4">
                      Example Preview
                    </div>
                    <div className="font-mono text-[11px] sm:text-[13px] md:text-[14px] leading-relaxed text-[#888888]">
                      <div className="py-0.5 text-[#6272a4]">{"// Available Examples"}</div>
                      <div className="py-0.5">
                        <span className="text-[#ff79c6]">const</span> examples = [
                      </div>
                      <div className="py-0.5 pl-4 text-[#f1fa8c]">&quot;Token Program&quot;,</div>
                      <div className="py-0.5 pl-4 text-[#f1fa8c]">&quot;NFT Minting&quot;,</div>
                      <div className="py-0.5 pl-4 text-[#f1fa8c]">&quot;PDA Accounts&quot;,</div>
                      <div className="py-0.5 pl-4 text-[#f1fa8c]">&quot;Staking Protocol&quot;,</div>
                      <div className="py-0.5 pl-4 text-[#f1fa8c]">&quot;AMM Swap&quot;</div>
                      <div className="py-0.5">];</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div
              ref={(el) => {
                sectionRefs.current[1] = el;
              }}
              data-section-index={1}
              className="min-h-[70vh] flex items-center py-10 md:py-16"
            >
              <div
                className={[
                  "w-full transition-all duration-200 ease-out",
                  activeIndex === 1
                    ? "opacity-100 translate-y-0"
                    : "opacity-20 translate-y-10"
                ].join(" ")}
              >
                <div className="mb-8">
                  <h3 className="text-2xl md:text-3xl font-semibold mb-3 tracking-[-0.01em]">
                    Read code with context
                  </h3>
                  <p className="text-base md:text-lg text-[#999999]">
                    Hover over instructions for inline explanations
                  </p>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-5">
                    {[
                      "Intelligent tooltips explain Solana-specific concepts as you read",
                      "Syntax highlighting and code structure visualization",
                      "Learn about accounts, instructions, and program architecture"
                    ].map((text) => (
                      <div
                        key={text}
                        className="flex items-start gap-4 p-5 bg-white/5/10 border-l-2 border-l-transparent rounded-lg transition-all duration-300 hover:bg-white/[0.04] hover:border-l-[#00ffa3] hover:translate-x-1"
                      >
                        <div className="mt-1 w-6 h-6 flex items-center justify-center">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="w-5 h-5 stroke-[#00ffa3] stroke-2"
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <p className="text-sm md:text-[15px] text-[#cccccc] leading-relaxed">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 md:p-8 mt-1 max-w-[580px]">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-[#666666] font-semibold mb-4">
                      Code with Context
                    </div>
                    <div className="font-mono text-[13px] md:text-[14px] leading-relaxed text-[#888888]">
                      <div className="py-0.5">
                        <span className="text-[#ff79c6]">pub fn</span>{" "}
                        <span className="text-[#50fa7b]">initialize</span>
                        (ctx: Context&lt;Initialize&gt;) &#123;
                      </div>
                      <div className="py-0.5 pl-4 text-[#6272a4]">
                        {"// Context provides account access ←"}
                      </div>
                      <div className="py-0.5 pl-4">
                        <span className="text-[#ff79c6]">let</span> vault = &amp;
                        <span className="text-[#ff79c6]">mut</span> ctx.accounts.vault;
                      </div>
                      <div className="py-0.5 pl-4">
                        vault.authority = ctx.accounts.user.key();
                      </div>
                      <div className="py-0.5 pl-4">
                        <span className="text-[#50fa7b]">Ok</span>(())
                      </div>
                      <div className="py-0.5">&#125;</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div
              ref={(el) => {
                sectionRefs.current[2] = el;
              }}
              data-section-index={2}
              className="min-h-[70vh] flex items-center py-10 md:py-16"
            >
              <div
                className={[
                  "w-full transition-all duration-200 ease-out",
                  activeIndex === 2
                    ? "opacity-100 translate-y-0"
                    : "opacity-20 translate-y-10"
                ].join(" ")}
              >
                <div className="mb-8">
                  <h3 className="text-2xl md:text-3xl font-semibold mb-3 tracking-[-0.01em]">
                    Run and inspect state
                  </h3>
                  <p className="text-base md:text-lg text-[#999999]">
                    See accounts, balances, and logs in real-time
                  </p>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-5">
                    {[
                      "Watch your program execute step-by-step in real-time",
                      "Visualize account state changes with clear data displays",
                      "Monitor SOL balances, token amounts, and all data fields"
                    ].map((text) => (
                      <div
                        key={text}
                        className="flex items-start gap-4 p-5 bg-white/5/10 border-l-2 border-l-transparent rounded-lg transition-all duration-300 hover:bg-white/[0.04] hover:border-l-[#00ffa3] hover:translate-x-1"
                      >
                        <div className="mt-1 w-6 h-6 flex items-center justify-center">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="w-5 h-5 stroke-[#00ffa3] stroke-2"
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <p className="text-sm md:text-[15px] text-[#cccccc] leading-relaxed">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 md:p-8 mt-1 max-w-[580px]">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-[#666666] font-semibold mb-4">
                      State Inspector
                    </div>
                    <div className="font-mono text-[13px] md:text-[14px] leading-relaxed text-[#888888]">
                      <div className="py-0.5">
                        Vault Account: <span className="text-[#f1fa8c]">&quot;7xKXt...&quot;</span>
                      </div>
                      <div className="py-0.5">
                        ├─ Balance: <span className="text-[#50fa7b]">10.5 SOL</span>
                      </div>
                      <div className="py-0.5">
                        ├─ Authority:{" "}
                        <span className="text-[#f1fa8c]">&quot;ABC123...&quot;</span>
                      </div>
                      <div className="py-0.5">
                        ├─ Status: <span className="text-[#50fa7b]">Initialized ✓</span>
                      </div>
                      <div className="py-0.5">
                        └─ Last Updated:{" "}
                        <span className="text-[#f1fa8c]">2 seconds ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div
              ref={(el) => {
                sectionRefs.current[3] = el;
              }}
              data-section-index={3}
              className="min-h-[70vh] flex items-center py-10 md:py-16"
            >
              <div
                className={[
                  "w-full transition-all duration-200 ease-out",
                  activeIndex === 3
                    ? "opacity-100 translate-y-0"
                    : "opacity-20 translate-y-10"
                ].join(" ")}
              >
                <div className="mb-8">
                  <h3 className="text-2xl md:text-3xl font-semibold mb-3 tracking-[-0.01em]">
                    Modify and rerun
                  </h3>
                  <p className="text-base md:text-lg text-[#999999]">
                    Experiment safely in a sandboxed environment
                  </p>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-5">
                    {[
                      "Make changes and instantly see the results—no deploy needed",
                      "Test edge cases and error handling without consequences",
                      "Reset state with one click to start fresh anytime"
                    ].map((text) => (
                      <div
                        key={text}
                        className="flex items-start gap-4 p-5 bg-white/5/10 border-l-2 border-l-transparent rounded-lg transition-all duration-300 hover:bg-white/[0.04] hover:border-l-[#00ffa3] hover:translate-x-1"
                      >
                        <div className="mt-1 w-6 h-6 flex items-center justify-center">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="w-5 h-5 stroke-[#00ffa3] stroke-2"
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <p className="text-sm md:text-[15px] text-[#cccccc] leading-relaxed">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 md:p-8 mt-1 max-w-[580px]">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-[#666666] font-semibold mb-4">
                      Live Editing
                    </div>
                    <div className="font-mono text-[13px] md:text-[14px] leading-relaxed text-[#888888]">
                      <div className="py-0.5 text-[#6272a4]">
                        {"// Modify values and rerun"}
                      </div>
                      <div className="py-0.5">
                        <span className="text-[#ff79c6]">let</span> amount ={" "}
                        <span className="text-[#f1fa8c]">100</span>;{" "}
                        <span className="text-[#6272a4]">
                          {"// ← Try different amounts"}
                        </span>
                      </div>
                      <div className="py-0.5">
                        <span className="text-[#50fa7b]">transfer</span>(amount)?;
                      </div>
                      <div className="py-0.5" />
                      <div className="py-0.5 text-[#6272a4]">
                        {"// Press Run to see changes instantly"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### `apps/web/components/landing/Examples.tsx`

```typescript
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Accounts",
    color: "#3B82F6",
    items: ["Account Initialization", "Account Validation", "Cross-Program Invocation"]
  },
  {
    title: "PDAs",
    color: "#8B5CF6",
    items: ["PDA Vault", "PDA Seeds", "Finding PDAs"]
  },
  {
    title: "Tokens",
    color: "#10B981",
    items: ["Token Creation", "Token Minting", "Token Transfers"]
  },
  {
    title: "NFTs",
    color: "#F59E0B",
    items: ["NFT Basics", "Metadata Standard", "Collection Management"]
  },
  {
    title: "DeFi",
    color: "#EF4444",
    items: ["AMM Basics", "Staking Pool", "Escrow Pattern"]
  }
];

export function Examples() {
  return (
    <section id="examples" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0A0A0A] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4 sm:gap-6 border-b border-[#262626] pb-6 sm:pb-8">
           <div>
             <span className="text-[#14F195] font-mono text-[10px] sm:text-xs uppercase tracking-wider mb-2 block">Library</span>
             <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-[#FAFAFA] leading-tight">
               Start from an example
             </h2>
           </div>
           <Link href="/examples" className="text-[#A3A3A3] text-xs sm:text-sm hover:text-[#FAFAFA] flex items-center gap-2 group">
             View all examples <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#262626] border border-[#262626] rounded-lg overflow-hidden">
          {categories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#0A0A0A] p-4 sm:p-6 hover:bg-[#111111] transition-colors group"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0" style={{ backgroundColor: category.color }} />
                <h3 className="text-xs sm:text-sm font-bold text-[#FAFAFA] uppercase tracking-wide">{category.title}</h3>
              </div>

              <ul className="space-y-2 sm:space-y-3">
                {category.items.map((item) => (
                  <li key={item}>
                    <Link
                      href="/signup"
                      className="block text-xs sm:text-sm text-[#737373] hover:text-[#FAFAFA] transition-colors py-1 group-hover/link"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
          {/* Empty cell filler if needed for perfect grid */}
           <div className="bg-[#0A0A0A] p-4 sm:p-6 flex items-center justify-center text-[#262626]">
              <span className="text-[10px] sm:text-xs font-mono uppercase">More coming soon</span>
           </div>
        </div>
      </div>
    </section>
  );
}
```
### `apps/web/components/landing/Trust.tsx`

```typescript
"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Check,
  Lock,
  Settings2,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

export function Trust() {
  const reduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  const items = [
    {
      key: "no-wallet",
      col: "lg:col-span-4 lg:row-span-2",
      pad: "p-6 md:p-7",
      icon: Lock,
      title: "No wallet required",
      desc: "Start coding immediately—no wallet connects, no private keys, no setup friction.",
      glow: "from-emerald-400/10 via-emerald-400/0 to-transparent",
    },
    {
      key: "stat-setup",
      col: "lg:col-span-3 lg:row-span-2",
      stat: "0",
      statLabel: "Setup time",
      statHint: "Open the Playground and go.",
      glow: "from-emerald-400/10 via-emerald-400/0 to-transparent",
    },
    {
      key: "stat-sandboxed",
      col: "lg:col-span-5 lg:row-span-2",
      stat: "100%",
      statLabel: "Sandboxed",
      statHint: "Safe, isolated execution.",
      glow: "from-emerald-400/10 via-emerald-400/0 to-transparent",
    },
    {
      key: "sandboxed",
      col: "lg:col-span-8 lg:row-span-3",
      icon: Zap,
      title: "100% sandboxed",
      desc: "Total isolation ensures your code can't touch mainnet or external systems. Test freely without unintended consequences.",
      glow: "from-purple-400/10 via-purple-400/0 to-transparent",
    },
    {
      key: "zero-config",
      col: "lg:col-span-4 lg:row-span-3",
      icon: Settings2,
      title: "Zero configuration",
      desc: "No installs, no dependencies, no local toolchains—just open and build.",
      glow: "from-blue-400/10 via-blue-400/0 to-transparent",
    },
    {
      key: "dev-features",
      col: "lg:col-span-6 lg:row-span-4",
      icon: Wrench,
      title: "Developer-friendly features",
      list: [
        "Deterministic execution for consistent testing",
        "No mainnet risk during development",
        "Real-time state visualization",
        "Instant program deployment",
        "Built-in debugging tools",
      ],
      glow: "from-emerald-400/10 via-emerald-400/0 to-transparent",
    },
    {
      key: "community",
      col: "lg:col-span-6 lg:row-span-4",
      pad: "p-6 md:p-7",
      badge: "OPEN SOURCE",
      icon: Users,
      title: "Community-powered",
      list: [
        "Active maintenance & updates",
        "Community-driven examples",
        "Issue tracking on GitHub",
        "Full documentation",
        "Discord community support",
      ],
      glow: "from-pink-400/10 via-pink-400/0 to-transparent",
    },
  ] as const;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0A0A0A] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4 sm:gap-6 border-b border-[#262626] pb-6 sm:pb-8">
          <div>
            <h2 className="text-[28px] sm:text-[36px] md:text-[40px] font-bold text-[#FAFAFA] leading-tight">
              Built for developers
            </h2>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-[#737373] max-w-[560px]">
              Everything you need to build, test, and deploy Solana programs—no
              setup required.
            </p>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.06 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-3 sm:gap-4 lg:grid-flow-dense lg:auto-rows-[88px] lg:items-stretch"
        >
          {items.map((item) => {
            const Icon = "icon" in item ? item.icon : null;

            return (
              <motion.div
                key={item.key}
                variants={fadeUp}
                className={[
                  "group relative overflow-hidden rounded-lg border border-[#262626] bg-[#0A0A0A]",
                  "pad" in item ? item.pad : "p-5 sm:p-6 md:p-7 lg:p-8",
                  "h-full min-h-0",
                  "transition-[transform,background-color,border-color] duration-200",
                  reduceMotion
                    ? "hover:bg-[#111111]"
                    : "hover:-translate-y-1 hover:bg-[#111111]",
                  "hover:border-[#14F195]/30",
                  "col-span-1",
                  item.col,
                ].join(" ")}
              >
                {/* Glow + shine */}
                <div
                  aria-hidden="true"
                  className={[
                    "pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl opacity-0",
                    "bg-gradient-to-br",
                    item.glow,
                    "transition-opacity duration-200 group-hover:opacity-100",
                  ].join(" ")}
                />
                <div
                  aria-hidden="true"
                  className={[
                    "pointer-events-none absolute inset-0 opacity-0",
                    "bg-[radial-gradient(1200px_circle_at_80%_0%,rgba(20,241,149,0.10),transparent_45%)]",
                    "transition-opacity duration-200 group-hover:opacity-100",
                  ].join(" ")}
                />

                <div className={[
                  "relative z-10 h-full min-h-0",
                  "horizontal" in item && item.horizontal ? "flex flex-row gap-4" : "flex flex-col"
                ].join(" ")}>
                  {("badge" in item && !("horizontal" in item && item.horizontal)) ? (
                    <div className="mb-4">
                      <span className="px-2.5 py-1 text-[10px] font-mono text-[#14F195] border border-[#14F195]/20 bg-[#14F195]/5 rounded uppercase tracking-wider">
                        {item.badge}
                      </span>
                    </div>
                  ) : null}

                  {"stat" in item ? (
                    <div className="h-full flex flex-col justify-center">
                      <div className="text-[32px] sm:text-[40px] md:text-[52px] leading-none font-bold tracking-tight text-[#14F195]">
                        {item.stat}
                      </div>
                      <div className="mt-2 sm:mt-3 text-[9px] sm:text-[10px] md:text-[11px] font-mono uppercase tracking-wider text-[#737373]">
                        {item.statLabel}
                      </div>
                      {"statHint" in item ? (
                        <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-[#A3A3A3]">
                          {item.statHint}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <>
                      {Icon ? (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#1A1A1A] border border-[#262626] flex items-center justify-center mb-4 sm:mb-6 text-[#FAFAFA] flex-shrink-0">
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                      ) : null}

                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-[#FAFAFA] mb-2 sm:mb-3 group-hover:text-[#14F195] transition-colors">
                          {"title" in item ? item.title : ""}
                        </h3>

                        {"desc" in item ? (
                          <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                            {item.desc}
                          </p>
                        ) : null}

                        {"list" in item ? (
                          <ul className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
                            {item.list.map((t) => (
                              <li
                                key={t}
                                className={[
                                  "flex items-start gap-2 text-[#A3A3A3]",
                                  "text-sm sm:text-base leading-snug"
                                ].join(" ")}
                              >
                                <Check className={[
                                  "flex-none text-[#14F195]",
                                  "w-4 h-4 sm:w-5 sm:h-4 mt-0.5 flex-shrink-0"
                                ].join(" ")} />
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
```

### `apps/web/components/landing/FinalCTA.tsx`

```typescript
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 bg-[#0A0A0A] border-t border-[#262626] text-center bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]">
      <div className="max-w-[600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-[28px] sm:text-[36px] md:text-[40px] font-bold text-[#FAFAFA] mb-4 sm:mb-6 px-4">
            Start understanding Solana
          </h2>
          <p className="text-[14px] sm:text-[16px] text-[#737373] mb-6 sm:mb-8 px-4">
            No setup. No risk. Just real programs and real execution.
          </p>

          <Link
            href="/playground/hello-solana"
            className="inline-block bg-[#14F195] text-[#0A0A0A] px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Open Solana Playground →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
```

### `apps/web/components/landing/Footer.tsx`

```typescript
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Twitter } from "lucide-react";


export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a] relative z-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]">
      {/* Moon-like Arc at Top */}
      <div className="absolute top-0 left-0 w-full h-10 overflow-hidden pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0,40 Q 600,0 1200,40"
            stroke="#000000"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            fill="none"
            type="path"
          />
        </svg>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-8 lg:gap-10 mb-10">
          {/* Brand Section */}
          <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <Image
                src="/logo/og.png"
                alt="Solana Atlas"
                width={50}
                height={50}
                className="w-[50px] h-[50px] flex-shrink-0 object-contain"
                unoptimized
              />
              <h2 className="text-xl font-semibold tracking-[0.05em] text-white">
                SOLANA ATLAS
              </h2>
            </div>
            <p className="text-[#888] leading-relaxed text-[0.95rem] max-w-[320px]">
              Interactive playground for learning Solana development. Run real
              programs, visualize state, and understand execution—all in your
              browser.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/Abhijitam01"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg flex items-center justify-center text-[#888] hover:bg-[#2a2a2a] hover:border-[#3a3a3a] hover:text-white transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/Abhijitam_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg flex items-center justify-center text-[#888] hover:bg-[#2a2a2a] hover:border-[#3a3a3a] hover:text-white transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-[0.75rem] font-semibold tracking-[0.1em] uppercase text-[#666] mb-4">
              Product
            </h3>
            <ul className="flex flex-col gap-2.5 list-none">
              <li>
                <Link
                  href="/playground/hello-solana"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  Playground
                </Link>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="#examples"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  Examples
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-[0.75rem] font-semibold tracking-[0.1em] uppercase text-[#666] mb-4">
              Resources
            </h3>
            <ul className="flex flex-col gap-2.5 list-none">
              <li>
                <a
                  href="https://github.com/Abhijitam01/solana-playground"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  Codebase{" "}
                  <span className="text-[0.75rem] opacity-50">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Abhijitam01/solana-playground"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Abhijitam01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Community Column */}
          <div>
            <h3 className="text-[0.75rem] font-semibold tracking-[0.1em] uppercase text-[#666] mb-4">
              Community
            </h3>
            <ul className="flex flex-col gap-2.5 list-none">
              <li>
                <a
                  href="https://x.com/Abhijitam_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  Twitter{" "}
                  <span className="text-[0.75rem] opacity-50">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/solana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  Discord
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-[0.75rem] font-semibold tracking-[0.1em] uppercase text-[#666] mb-4">
              Legal
            </h3>
            <ul className="flex flex-col gap-2.5 list-none">
              <li>
                <a
                  href="#"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#999] text-[0.95rem] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1a1a1a] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[#666] text-sm">
            © 2026 Solana Atlas. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-[#666]">
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              Cookies Settings
            </a>
          </div>
        </div>
      </div>

      {/* Large Background Text */}
      <div className="w-full relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="text-center select-none pointer-events-none"
            style={{
              fontSize: 'clamp(8rem, 20vw, 24rem)',
              fontWeight: '900',
              letterSpacing: '-0.05em',
              lineHeight: '1',
              color: '#1a1a1a',
              whiteSpace: 'nowrap',
              fontFamily: 'sans-serif',
            }}
          >
            ATLAS
          </div>
        </div>
      </div>
    </footer>
  );
}
```
## Pages & Layout

### `apps/web/app/landing-page.tsx`

```typescript
"use client";

import React, { useState } from "react";
import { AuthButton } from "@/components/auth/AuthButton";
import { Hero } from "@/components/landing/Hero";
import { ProductDemo } from "@/components/landing/ProductDemo";
import { WhySwitch } from "@/components/landing/WhySwitch";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Examples } from "@/components/landing/Examples";
import { Trust } from "@/components/landing/Trust";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Menu, X } from "lucide-react";

export default function SolanaAtlasLanding() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] font-sans selection:bg-[#14F195] selection:text-[#0A0A0A] relative">
      {/* Global Grid Background - Always behind all content */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 border-b border-[#262626] backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between">
          <Logo height={72} className="text-[#FAFAFA] sm:h-[88px]" />

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/playground/hello-solana"
              className="text-base font-semibold text-[#FAFAFA] hover:text-[#14F195] transition-colors"
            >
              Open Playground
            </Link>
            <a
              href="#how-it-works"
              className="text-base font-medium text-[#737373] hover:text-[#FAFAFA] transition-colors"
            >
              How it works
            </a>
            <a
              href="#examples"
              className="text-base font-medium text-[#737373] hover:text-[#FAFAFA] transition-colors"
            >
              Examples
            </a>
            {user && (
              <Link
                href="/dashboard"
                className="text-base font-medium text-[#737373] hover:text-[#FAFAFA] transition-colors"
              >
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <AuthButton />
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#FAFAFA] hover:text-[#14F195] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="hidden md:block">
              <AuthButton />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#262626] bg-[#0A0A0A]">
            <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col gap-4">
              <Link
                href="/playground/hello-solana"
                className="text-base font-semibold text-[#FAFAFA] hover:text-[#14F195] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Open Playground
              </Link>
              <a
                href="#how-it-works"
                className="text-base font-medium text-[#737373] hover:text-[#FAFAFA] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it works
              </a>
              <a
                href="#examples"
                className="text-base font-medium text-[#737373] hover:text-[#FAFAFA] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Examples
              </a>
              {user && (
                <Link
                  href="/dashboard"
                  className="text-base font-medium text-[#737373] hover:text-[#FAFAFA] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="divide-y divide-[#262626] relative z-10">
        <Hero />
        <ProductDemo />
        <div className="hidden md:block">
          <WhySwitch />
        </div>
        <HowItWorks />
        <Examples />
        <Trust />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
```

### `apps/web/app/providers.tsx`

```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from '@trpc/client';
import { useState, useEffect } from "react";
import { useSettingsStore } from "@/stores/settings";
import { trpc } from "@/lib/trpc-client";
import { AuthProvider } from "@/components/providers/AuthProvider";
import superjson from "superjson";

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
        }),
      ],
    })
  );

  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("solana-playground-settings");
    if (!stored) {
      setTheme("dark");
    }
  }, [setTheme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // For pure frontend layout without TRPC, remove the trpc.Provider wrapper
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

### `apps/web/app/layout.tsx`

```typescript
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";
// import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/next";
import { StructuredData } from "@/components/seo/StructuredData";

import { getBaseUrl } from "@/lib/seo";

const siteUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Solana Atlas - Interactive Solana Programming Playground",
    template: "%s | Solana Atlas"
  },
  description: "Learn Solana programming through interactive, explorable code. Run real Solana programs, watch state transform, and understand execution—not just syntax. Zero setup. No wallet. Open source.",
  keywords: [
    "Solana",
    "Solana programming",
    "Solana development",
    "blockchain development",
    "Web3",
    "interactive coding",
  ],
  authors: [{ name: "Solana Atlas Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Solana Atlas",
    title: "Solana Atlas - Interactive Solana Programming Playground",
    description: "Learn Solana programming through interactive, explorable code.",
    images: [
      {
        url: "/logo/og.png",
        width: 1200,
        height: 630,
        alt: "Solana Atlas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solana Atlas",
    description: "Learn Solana programming through interactive, explorable code.",
    images: ["/logo/og.png"],
  },
};

export const viewport: Metadata["viewport"] = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <StructuredData />
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
        {/* <Analytics /> */}
        {/* <SpeedInsights /> */}
      </body>
    </html>
  );
}
```

### `apps/web/app/page.tsx`

```typescript
import LandingPage from "./landing-page";

// Note: Metadata is defined in app/layout.tsx
// We don't export metadata here to avoid conflicts with client components
export default function Home() {
  return <LandingPage />;
}
```
