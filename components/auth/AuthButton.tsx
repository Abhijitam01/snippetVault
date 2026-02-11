'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function AuthButton() {
  const { user, loading, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (loading) {
    return (
      <div className="w-10 h-10 flex items-center justify-center">
        <LoadingSpinner size="sm" className="text-gray-400" text="Loading" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 p-[1px]"
        >
          <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center overflow-hidden">
             <span className="font-bold text-violet-600 dark:text-violet-400 text-sm">
                {(user.name?.[0] || user.email[0]).toUpperCase()}
             </span>
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
                className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 shadow-xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100 dark:border-white/10">
                  <p className="text-sm font-medium truncate text-gray-900 dark:text-white">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-white/40 truncate">{user.email}</p>
                </div>

                <div className="p-1">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
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
        href="/auth/login"
        className="text-sm sm:text-base font-medium text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors flex-shrink-0"
      >
        Sign In
      </Link>
      <Link
        href="/auth/signup"
        className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all text-sm sm:text-base font-medium flex-shrink-0 text-gray-900 dark:text-white"
      >
        Sign Up
      </Link>
    </div>
  );
}
