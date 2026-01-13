'use client';

import { useEffect, useState } from 'react';

export default function SmoothCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a, button, [role="button"]') !== null
      );
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      setCursorPosition((prev) => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.15,
        y: prev.y + (mousePosition.y - prev.y) * 0.15,
      }));
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePosition]);

  return (
    <>
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          transform: `translate(${cursorPosition.x - 20}px, ${cursorPosition.y - 20}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <div
          className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
            isPointer
              ? 'border-blue-500 bg-blue-500/10 scale-150'
              : 'border-white/30 bg-white/5 scale-100'
          }`}
        />
      </div>
      
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          transform: `translate(${cursorPosition.x - 3}px, ${cursorPosition.y - 3}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            isPointer ? 'bg-blue-500' : 'bg-white'
          }`}
        />
      </div>
    </>
  );
}

