'use client';

import { useState, useEffect } from 'react';

const ONBOARDING_STORAGE_KEY = 'snippetvault_onboarding_completed';

export function useOnboarding() {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage to see if user has completed onboarding
    const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    setShouldShowOnboarding(completed !== 'true');
    setIsLoading(false);
  }, []);

  const completeOnboarding = (dontShowAgain: boolean = false) => {
    if (dontShowAgain) {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    }
    setShouldShowOnboarding(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    setShouldShowOnboarding(true);
  };

  return {
    shouldShowOnboarding,
    isLoading,
    completeOnboarding,
    resetOnboarding,
  };
}

