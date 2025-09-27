"use client";

import { ReactNode } from "react";
import { useHydration } from "@/hooks/use-hydration";

interface ConditionalMotionProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ConditionalMotion({ children, fallback }: ConditionalMotionProps) {
  const isHydrated = useHydration();

  // Don't render motion components until hydrated
  if (!isHydrated) {
    return <>{fallback || null}</>;
  }

  return <>{children}</>;
}
