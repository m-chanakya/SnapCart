"use client";

import { useRef, useEffect, useState } from "react";
import { useHydration } from "./use-hydration";

export function useSimpleScroll() {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const isHydrated = useHydration();
  const [headerDisabled, setHeaderDisabled] = useState<boolean>(false);
  const [headerOpacity, setHeaderOpacity] = useState<number>(1);

  useEffect(() => {
    if (!isHydrated || !scrollAreaRef.current) return;

    const handleScroll = () => {
      const scrollTop = scrollAreaRef.current?.scrollTop || 0;
      const threshold = 64;
      
      setHeaderDisabled(scrollTop >= threshold);
      setHeaderOpacity(Math.max(0, 1 - scrollTop / threshold));
    };

    const element = scrollAreaRef.current;
    element.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [isHydrated]);

  return {
    scrollAreaRef,
    headerOpacity,
    headerDisabled,
    isHydrated
  };
}
