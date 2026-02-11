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
import ThemeToggle from "@/components/ui/ThemeToggle";
import Logo from "@/components/ui/Logo";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { Menu, X } from "lucide-react";

export default function SnippetVaultLanding() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-[#FAFAFA] font-sans selection:bg-[#8B5CF6] selection:text-white relative transition-colors duration-300">
      {/* Global Grid Background - Vertical Lines Only */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_100%]"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0A0A0A]/90 border-b border-gray-100 dark:border-[#262626] backdrop-blur-md transition-colors duration-300">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
             <Logo size={40} className="text-gray-900 dark:text-[#FAFAFA] group-hover:scale-105 transition-transform" />
             <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white hidden sm:block">SnippetVault</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-[#737373] dark:hover:text-[#FAFAFA] transition-colors"
            >
              How it works
            </a>
            <a
              href="#features"
              className="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-[#737373] dark:hover:text-[#FAFAFA] transition-colors"
            >
              Features
            </a>
            {user && (
              <Link
                href="/dashboard"
                className="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-[#737373] dark:hover:text-[#FAFAFA] transition-colors"
              >
                Dashboard
              </Link>
            )}
            
            {/* Added: Theme Toggle could be here if we had one component for it, but sticking to system/class pref for now */}
          </div>

          <div className="flex items-center gap-3">
             <ThemeToggle />
             <div className="hidden md:block">
              <AuthButton />
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-900 dark:text-[#FAFAFA] hover:text-[#14F195] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-[#262626] bg-white dark:bg-[#0A0A0A]">
            <div className="max-w-[1200px] mx-auto px-4 py-6 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <a
                  href="#how-it-works"
                  className="text-lg font-medium text-gray-600 hover:text-gray-900 dark:text-[#737373] dark:hover:text-[#FAFAFA] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How it works
                </a>
                <a
                  href="#features"
                  className="text-lg font-medium text-gray-600 hover:text-gray-900 dark:text-[#737373] dark:hover:text-[#FAFAFA] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                {user && (
                  <Link
                    href="/dashboard"
                    className="text-lg font-medium text-gray-600 hover:text-gray-900 dark:text-[#737373] dark:hover:text-[#FAFAFA] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-[#262626]">
                <AuthButton />
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="divide-y divide-gray-100 dark:divide-[#262626] relative z-10">
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
