"use client";

import { useEffect } from "react";

export default function HydrationFix() {
  useEffect(() => {
    // Remove any attributes added by browser extensions that might cause hydration issues
    const body = document.body;
    if (body) {
      // Remove Grammarly attributes
      body.removeAttribute('data-new-gr-c-s-check-loaded');
      body.removeAttribute('data-gr-ext-installed');
      
      // Remove other common extension attributes
      body.removeAttribute('data-gramm');
      body.removeAttribute('data-gramm_editor');
      body.removeAttribute('data-gramm_editor_plugin');
    }
  }, []);

  return null;
}
