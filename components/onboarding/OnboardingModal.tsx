'use client';

import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, FileText, FolderTree, Search, Star, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface OnboardingStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    icon: <Sparkles className="w-8 h-8 text-purple-400" />,
    title: 'Welcome to SnippetVault',
    description: 'Your personal code snippet manager. Organize, search, and access your code snippets effortlessly. No clutter, just you and your code.',
  },
  {
    icon: <FileText className="w-8 h-8 text-blue-400" />,
    title: 'Create Your First Snippet',
    description: 'Click "New snippet" in the sidebar to add code snippets. Add a title, select a language, choose a category, and add tags to organize your snippets.',
  },
  {
    icon: <FolderTree className="w-8 h-8 text-green-400" />,
    title: 'Organize with Categories & Tags',
    description: 'Create categories to group related snippets. Add tags to make snippets searchable. Use filters in the dashboard to quickly find what you need.',
  },
  {
    icon: <Search className="w-8 h-8 text-yellow-400" />,
    title: 'Search & Filter',
    description: 'Use the search bar to find snippets by title or content. Filter by language, category, or tags. Your snippets are instantly searchable.',
  },
  {
    icon: <Star className="w-8 h-8 text-amber-400" />,
    title: 'Star Your Favorites',
    description: 'Click the star icon on any snippet to mark it as a favorite. Filter by favorites to quickly access your most-used code snippets.',
  },
];

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: (dontShowAgain: boolean) => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    onClose(dontShowAgain);
  };

  const handleSkip = () => {
    onClose(dontShowAgain);
  };

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4">
        <div className="bg-gradient-to-br from-black/90 to-black/80 border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  index === currentStep
                    ? 'w-8 bg-purple-500'
                    : index < currentStep
                    ? 'w-4 bg-purple-500/50'
                    : 'w-4 bg-white/10'
                )}
              />
            ))}
          </div>

          {/* Step content */}
          <div className="text-center mb-8 min-h-[200px] flex flex-col items-center justify-center">
            <div className="mb-6 flex items-center justify-center">
              {currentStepData.icon}
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4 font-mono">
              {currentStepData.title}
            </h2>
            <p className="text-white/70 font-mono text-sm leading-relaxed max-w-md">
              {currentStepData.description}
            </p>
          </div>

          {/* Step counter */}
          <div className="text-center mb-6">
            <span className="text-xs text-white/50 font-mono">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          {/* Don't show again checkbox */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <label className="inline-flex items-center gap-2 text-sm text-white/70 cursor-pointer font-mono">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-black/60 text-purple-500 focus:ring-purple-500/60"
              />
              <span>Don't show this again</span>
            </label>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-white/60 hover:text-white"
            >
              Skip
            </Button>

            <div className="flex items-center gap-2">
              {!isFirstStep && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  className="text-white/80 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
              )}
              <Button
                onClick={handleNext}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 border border-purple-500/50"
              >
                {isLastStep ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Get Started
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

