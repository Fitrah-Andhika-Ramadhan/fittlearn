"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const hasTracked = useRef<string | null>(null);

  useEffect(() => {
    // Only track if we haven't tracked this path yet to prevent double-firing in React Strict Mode
    if (pathname && hasTracked.current !== pathname) {
      hasTracked.current = pathname;

      fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: pathname }),
      }).catch((err) => {
        // Silently fail for analytics
        console.error("Failed to track page visit", err);
      });
    }
  }, [pathname]);

  return null; // This component does not render anything
}
