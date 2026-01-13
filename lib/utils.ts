import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function parseResources(resources: string | null): string[] {
  if (!resources) return [];
  try {
    return JSON.parse(resources);
  } catch {
    return [];
  }
}

export function stringifyResources(resources: string[]): string {
  return JSON.stringify(resources);
}

export const languageColors: Record<string, string> = {
  typescript: '#3178C6',
  javascript: '#F7DF1E',
  python: '#3776AB',
  java: '#ED8B00',
  cpp: '#00599C',
  c: '#A8B9CC',
  csharp: '#239120',
  go: '#00ADD8',
  rust: '#000000',
  php: '#777BB4',
  ruby: '#CC342D',
  swift: '#FA7343',
  kotlin: '#7F52FF',
  html: '#E34F26',
  css: '#1572B6',
  sql: '#336791',
  yaml: '#CB171E',
  json: '#000000',
  markdown: '#083FA1',
  bash: '#89E051',
  shell: '#89E051',
};

export function getLanguageColor(language: string): string {
  return languageColors[language.toLowerCase()] || '#6B7280';
}

