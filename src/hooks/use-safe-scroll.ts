"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { useHydration } from "./use-hydration";

export function useSafeScroll() {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const isHydrated = useHydration();
  const [headerDisabled, setHeaderDisabled] = useState<boolean>(false);
  const [refReady, setRefReady] = useState<boolean>(false);
  
  // Check if ref is ready
  useEffect(() => {
    if (isHydrated && scrollAreaRef.current) {
      setRefReady(true);
    }
  }, [isHydrated]);
  
  // Only use scroll hooks when hydrated and ref is ready
  const { scrollY } = useScroll({ 
    container: refReady ? scrollAreaRef : null,
    enabled: refReady
  });
  
  const headerScrollThreshold = 64;
  const headerOpacity = useTransform(scrollY, [0, headerScrollThreshold], [1, 0]);

  useMotionValueEvent(scrollY, "change", (y) => {
    if (!refReady) return;
    const disable = y >= headerScrollThreshold;
    setHeaderDisabled(disable);
  });

  return {
    scrollAreaRef,
    headerOpacity,
    headerDisabled,
    isHydrated,
    refReady
  };
}
