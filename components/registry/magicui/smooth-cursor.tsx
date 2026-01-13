"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SmoothCursorProps {
  className?: string;
}

export function SmoothCursor({ className }: SmoothCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const targetPositionRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      targetPositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const cursor = cursorRef.current;
      
      if (!cursor) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const ease = 0.15;
      positionRef.current.x += (targetPositionRef.current.x - positionRef.current.x) * ease;
      positionRef.current.y += (targetPositionRef.current.y - positionRef.current.y) * ease;

      cursor.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", updateMousePosition);
    animate();

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-[9999] w-6 h-6 -translate-x-1/2 -translate-y-1/2",
        className
      )}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          d="M3 3L18 18L9 21L12 12L3 9L9 2L13 6L3 3Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

