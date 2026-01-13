'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export default function Logo({ className, size = 24, showText = false }: LogoProps) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="safeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#9ca3af', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#6b7280', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#4b5563', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="safeHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Safe body with rounded corners */}
        <rect x="4" y="6" width="24" height="20" rx="2" fill="url(#safeGradient)" stroke="#374151" strokeWidth="0.5"/>
        
        {/* Highlight on top */}
        <rect x="4" y="6" width="24" height="8" rx="2" fill="url(#safeHighlight)"/>
        
        {/* Hinges on the left */}
        <rect x="2" y="10" width="2" height="3" rx="0.5" fill="#4b5563"/>
        <rect x="2" y="15" width="2" height="3" rx="0.5" fill="#4b5563"/>
        
        {/* Door frame */}
        <rect x="8" y="10" width="16" height="12" rx="1" fill="#1f2937" stroke="#374151" strokeWidth="0.5"/>
        
        {/* Glowing code symbol {</>} */}
        <text 
          x="16" 
          y="18" 
          fontFamily="ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace" 
          fontSize="9" 
          fontWeight="bold" 
          fill="#60a5fa" 
          textAnchor="middle" 
          filter="url(#glow)"
          opacity="0.95"
        >
          {'{</>}'}
        </text>
        
        {/* Additional glow effect */}
        <circle cx="16" cy="16" r="8" fill="white" opacity="0.1" filter="url(#glow)"/>
      </svg>
      {showText && (
        <span className="font-mono text-sm font-semibold">SnippetVault</span>
      )}
    </div>
  );
}

