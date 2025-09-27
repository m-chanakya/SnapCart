"use client";

import { ReactNode } from "react";
import { useHydration } from "@/hooks/use-hydration";

interface MotionSafeProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function MotionSafe({ children, fallback }: MotionSafeProps) {
  const isHydrated = useHydration();

  if (!isHydrated) {
    return <>{fallback || <div className="animate-pulse bg-gray-100 rounded-lg h-32" />}</>;
  }

  return <>{children}</>;
}
