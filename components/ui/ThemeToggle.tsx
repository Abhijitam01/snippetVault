'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Button from './Button';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 h-9 px-0">
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const cycleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('system');
    } else {
      setTheme('dark');
    }
  };

  const getIcon = () => {
    if (theme === 'system') return <Monitor className="w-4 h-4 text-violet-500" />;
    if (theme === 'dark') return <Moon className="w-4 h-4 text-violet-400" />;
    return <Sun className="w-4 h-4 text-amber-500" />;
  };

  const getLabel = () => {
    if (theme === 'system') return 'System';
    if (theme === 'dark') return 'Dark';
    return 'Light';
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      title={`Theme: ${getLabel()} (click to cycle)`}
      className="gap-2 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors"
    >
      {getIcon()}
      <span className="hidden sm:inline font-mono text-xs text-gray-600 dark:text-gray-400">{getLabel()}</span>
    </Button>
  );
}

