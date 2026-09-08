"use client";

import React, { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  // Complete progress on route change
  useEffect(() => {
    if (visible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept link clicks to trigger instant visual feedback
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");

      // Only handle internal links without new tab or modified keys
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("//") &&
        targetAttr !== "_blank" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        // If clicking link to current page (including exact hash), ignore
        const currentUrl = `${window.location.pathname}${window.location.search}`;
        if (href === currentUrl || href === window.location.pathname) {
          return;
        }

        setVisible(true);
        setProgress(25);

        // Gradually increment to show ongoing loading
        const timer1 = setTimeout(() => setProgress(65), 150);
        const timer2 = setTimeout(() => setProgress(85), 400);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[2.5px] bg-transparent">
      {/* Progress Line */}
      <div
        className="h-full bg-gradient-to-r from-[#B38F28] via-[#D4AF37] to-[#F3E5AB] transition-all duration-200 ease-out shadow-[0_0_10px_#D4AF37]"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
        }}
      />
      {/* Leading Glow Dot */}
      {visible && (
        <div
          className="absolute top-0 w-8 h-full bg-white blur-xs transition-all duration-200"
          style={{
            left: `calc(${progress}% - 32px)`,
          }}
        />
      )}
    </div>
  );
}
